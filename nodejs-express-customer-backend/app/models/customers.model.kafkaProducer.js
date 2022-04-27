const { Kafka } = require('kafkajs')
const kafkaProducer = function() {

}

const kafka = new Kafka({
    clientId: 'customer-events',
    brokers: ['b-1.diss-a3-mskcluster.6unmre.c7.kafka.us-east-2.amazonaws.com:9092','b-2.diss-a3-mskcluster.6unmre.c7.kafka.us-east-2.amazonaws.com:9092','b-3.diss-a3-mskcluster.6unmre.c7.kafka.us-east-2.amazonaws.com:9092']
})

const producer = kafka.producer()


kafkaProducer.sendMessage = (message, result) => {
    const run = async () => {
        await producer.connect()
        console.log(message)
        const result = JSON.stringify(message)
        await producer.send({
            topic: 'a3.customers.evt',
            messages: [
                { key: 'key1', value: result}
            ],
        })
        //console.log(JSON.stringify(message))
    }
    run().catch(e => console.error(`[example/producer] ${e.message}`, e))

    const errorTypes = ['unhandledRejection', 'uncaughtException']
    const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

    errorTypes.forEach(type => {
        process.on(type, async () => {
            try {
                console.log(`process.on ${type}`)
                await producer.disconnect()
                process.exit(0)
            } catch (_) {
                process.exit(1)
            }
        })
    })

    signalTraps.forEach(type => {
        process.once(type, async () => {
            try {
                await producer.disconnect()
            } finally {
                process.kill(process.pid, type)
            }
        })
    })
    console.log(result)

}



module.exports = kafkaProducer;