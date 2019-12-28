import mysql from './mysql'

const getUserIdByKey = async (apiKey: string) : Promise<number | null> => {
    const db = await mysql.connect()

    const [results] = await db.execute('SELECT `user_id` FROM `keys` WHERE `key` = ? AND `deleted_at` IS NULL', [apiKey])

    if (results.length != 1)
        return null

    return results[0]['user_id']
}

const getUserQuota = async (userId: number) : Promise<number | null> => {
    const db = await mysql.connect()

    const [results] = await db.execute('SELECT `quota` FROM `users` WHERE `id` = ?', [userId])

    if (results.length != 1)
        return null

    return results[0]['quota']
}

const reduceUserQuota = async (userId: number, quota: number) : Promise<boolean> => {
    const db = await mysql.connect()

    const [results] = await db.execute('UPDATE `users` SET `quota` = `quota` - ? WHERE `id` = ?', [quota, userId])

    if (results.changedRows != 1)
        return false

    return true
}

const logDataUsage = async (apiKey: string, usage: number) : Promise<boolean> => {
    const db = await mysql.connect()

    let [results] = await db.execute('SELECT `id` AS `key_id`, `user_id` FROM `keys` WHERE `key` = ? AND `deleted_at` IS NULL', [apiKey])

    const keyId = results[0]['key_id']
    const userId = results[0]['user_id']

    ;[results] = await db.execute('INSERT INTO `data_usage` (`date`, `user_id`, `key_id`, `usage`) VALUES (CURRENT_DATE(), ?, ?, ?) '
    + 'ON DUPLICATE KEY UPDATE `usage` = `usage` + ?', [userId, keyId, usage, usage])

    if (results.affectedRows != 1)
        return false

    return true
}

export default {
    getUserIdByKey,
    getUserQuota,
    reduceUserQuota,
    logDataUsage
}