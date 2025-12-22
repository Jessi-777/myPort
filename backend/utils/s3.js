const {
  S3Client,
  GetObjectCommand
} = require("@aws-sdk/client-s3");

const {
  getSignedUrl
} = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

async function generateSignedUrl(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: key,
  });

  return await getSignedUrl(s3, command, {
    expiresIn: parseInt(process.env.SIGNED_URL_EXPIRES),
  });
}

module.exports = generateSignedUrl;
