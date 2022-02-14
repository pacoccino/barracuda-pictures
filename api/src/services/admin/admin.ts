import faktory from 'faktory-worker'

export const scan = async () => {
  const client = await faktory.connect()

  const args = {}
  await client.job('scan', args).push()
  await client.close()

  return { success: true }
}
