## Environment

In addition to `DATABASE_URL` and `JWT_SECRET`, configure the Cloudflare R2 S3 API:

```env
R2_ENDPOINT=https://321b35de53b0fdc9c671de49304ffb66.r2.cloudflarestorage.com/agriverse-storage
R2_BUCKET=agriverse-storage
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
```

`R2_ENDPOINT` may include the bucket path shown above. Dataset uploads are stored under `datasets/`, and authorized license downloads are streamed from R2.
