// @ts-nocheck 
const manager = async () => {
    const r = await getServerRange(zkClient, "/poc")
    console.log({ r })
    if (!r.success) {
        process.exit(1)
        // return res.status(400).json({ message: 'not available' })
    }
    const inc = await getCount(redisClient, r.range)
}