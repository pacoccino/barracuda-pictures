import fs from 'fs'

export async function listDir(path: string): Promise<Array<string>> {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if(err) {
        reject(err)
      } else {
        resolve(files)
      }
    })
  })
}
