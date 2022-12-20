import tf from '@tensorflow/tfjs-node'
import faceapi from '@vladmandic/face-api'

let optionsSSDMobileNet
const minConfidence = 0.1
const distanceThreshold = 0.5
const modelPath = __dirname + '/node_modules/@vladmandic/face-api/model'

async function initFaceAPI() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath)
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath)
  await faceapi.nets.faceExpressionNet.loadFromDisk(modelPath)
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath)
  optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({
    minConfidence,
    maxResults: 1,
  })
}

async function detect(buffer: Buffer) {
  const tensor = tf.node.decodeImage(buffer, 3)
  const faces = await faceapi
    .detectAllFaces(tensor, optionsSSDMobileNet)
    .withFaceLandmarks()
    .withFaceExpressions()
    .withFaceDescriptors()
  tf.dispose(tensor)
  return faces
}

async function findBestMatch(labeledFaceDescriptors, buffer) {
  const matcher = new faceapi.FaceMatcher(
    labeledFaceDescriptors,
    distanceThreshold
  )
  const descriptors = await getDescriptors(buffer)
  const matches = []
  for (const descriptor of descriptors) {
    const match = await matcher.findBestMatch(descriptor)
    matches.push(match)
  }
  return matches
}

export const hello = (i) => i + 2
