const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const crypto = require("crypto");
const path = require("path");
const env = require("../../config/env");

let client;

function getClient() {
  if (client) return client;
  if (!env.r2Endpoint || !env.r2AccessKeyId || !env.r2SecretAccessKey) {
    throw new Error(
      "R2 storage is not configured. Set R2_ENDPOINT, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY.",
    );
  }

  const endpoint = new URL(env.r2Endpoint);
  if (endpoint.pathname.replace(/\/$/, "") === `/${env.r2Bucket}`) {
    endpoint.pathname = "/";
  }

  client = new S3Client({
    region: "auto",
    endpoint: endpoint.toString(),
    credentials: {
      accessKeyId: env.r2AccessKeyId,
      secretAccessKey: env.r2SecretAccessKey,
    },
  });
  return client;
}

function createObjectKey(originalName) {
  const extension = path.extname(originalName).toLowerCase();
  return `datasets/${Date.now()}-${crypto.randomBytes(16).toString("hex")}${extension}`;
}

async function uploadDataset(file) {
  const key = createObjectKey(file.originalname);
  await getClient().send(
    new PutObjectCommand({
      Bucket: env.r2Bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );
  return key;
}

function getDataset(key) {
  return getClient().send(
    new GetObjectCommand({ Bucket: env.r2Bucket, Key: key }),
  );
}

async function deleteDataset(key) {
  await getClient().send(
    new DeleteObjectCommand({ Bucket: env.r2Bucket, Key: key }),
  );
}

module.exports = { uploadDataset, getDataset, deleteDataset };
