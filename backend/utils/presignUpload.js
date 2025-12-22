const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// get a presigned PUT URL for a new object
async function getPresignedPutUrl({ key, contentType }) {
  const cmd = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ContentType: contentType
  });
  const url = await getSignedUrl(s3, cmd, { expiresIn: 60 * 5 }); // 5 min
  return url;
}

module.exports = { getPresignedPutUrl };
