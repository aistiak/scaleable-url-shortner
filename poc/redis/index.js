var redis = require("redis")

var {createClient} = redis ;

var client = createClient({
    url :'redis://localhost:6379'
}) ;

(async ()=> {

    client.on('error',(err)=>{
        console.log(` redis client error`)
    })
    
    await client.connect()
    console.log(`setting key`)
    await client.set('name','istiak')
    console.log(`getting key`)
    const value = await client.get('name')
    console.log(value)

    // client.disconnect()
})()