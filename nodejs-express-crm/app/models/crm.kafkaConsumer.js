const { Kafka } = require('kafkajs');
const mailer = require('./crm.mailingService');
//const host = "";

const kafka = new Kafka({
    brokers: ['b-1.diss-a3-mskcluster.6unmre.c7.kafka.us-east-2.amazonaws.com:9092','b-2.diss-a3-mskcluster.6unmre.c7.kafka.us-east-2.amazonaws.com:9092','b-3.diss-a3-mskcluster.6unmre.c7.kafka.us-east-2.amazonaws.com:9092:9092'],
    clientId: 'consumer-crm',
})

const topic = 'a3.customers.evt'
const consumer = kafka.consumer({ groupId: 'test-group' })

exports.consume = () => {
    let result = "";
    const run = async () => {
        await consumer.connect()
        await consumer.subscribe({topic, fromBeginning: true})
        await consumer.run({
            // eachBatch: async ({ batch }) => {
            //   console.log(batch)
            // },
            eachMessage: async ({topic, partition, message}) => {
                const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
                console.log(`- ${prefix} ${message.key}#${message.value}`)
                const res = JSON.parse(message.value.toString());
                const name = res.name;
                const userId = res.userId;
                result = {"name": name, "email": userId }
                console.log(result);
                mailer.sendEmail(result.email, result.name);
            },
        })
    }

    run().catch(e => console.error(`[example/consumer] ${e.message}`, e));


    const errorTypes = ['unhandledRejection', 'uncaughtException']
    const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

    errorTypes.forEach(type => {
        process.on(type, async e => {
            try {
                console.log(`process.on ${type}`)
                console.error(e)
                await consumer.disconnect()
                process.exit(0)
            } catch (_) {
                process.exit(1)
            }
        })
    })

    signalTraps.forEach(type => {
        process.once(type, async () => {
            try {
                await consumer.disconnect()
            } finally {
                process.kill(process.pid, type)
            }
        })
    })
    return result;

}