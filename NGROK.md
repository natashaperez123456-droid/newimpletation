# Ngrok quick start (Saleor webhooks)

This project uses ngrok to expose the local Next.js server for Saleor webhooks.

## Start
1) Run ngrok:
```
ngrok http 3000
```

2) Get the public URL:
```
Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels" | Select-Object -ExpandProperty tunnels | Select-Object -ExpandProperty public_url
```

3) Update the Saleor webhook URL:
```
https://<NGROK_URL>/api/revalidate?secret=lytcG0lzZICSCzhegWpli9bovHekGX&tags=menu:navbar&tags=categories
```

## Stop
- Close the ngrok window/process.

## Notes
- If ngrok restarts, the URL changes. Update the webhook each time.
- Make sure Next.js is running on port 3000.
