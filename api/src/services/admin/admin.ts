import faktory from 'faktory-worker'

export const scan = async () => {
  const client = await faktory.connect({
    password: process.env['FAKTORY_PASSWORD'],
  })

  const args = {}
  await client.job('scan', args).push()
  await client.close()

  return { success: true }
}
