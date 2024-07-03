# Simple todo list app without security

This sample demonstrates a simple Blazor WebAssembly application that implements a todo list app without user management.
All endpoints are publicly accessible and no login is required.

## Set up the backend API

Go to https://portal.restapi.com and create a new empty API. Then go to Data -> Collections & Views and select the source tab. Paste in the contents of the schema.json file located in the RestAPISchema folder in the src directory and click Save. You should now have the structure needed to run the app.

## Change appsettings.json

In the appsettings.json in the wwwroot folder, change the BackendUrl to be your API address - found in the Overview section in the portal for your API.

```js
export default defineConfig({
  server: {
    port: 3000,
    hmr: true,
    proxy: {
      "/api": {
        target: "<Your API address found in the Overview section in the portal.>",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [react(), mkcert()],
});
```

- Replace `"BackendUrl": "<Your API address found in the Overview section in the portal.>",` to (for example) `target: "https://eu.restapi.com/mysampleapi",`

## Run the sample

- Open a terminal and navigate to the sample directory
- Run `npm install`
- Run `npm run dev`

The sample is set up to generate a locally signed certificate using mkcert so that you can run https locally.
<br />The solution will be available at https://localhost:3000

![alt text](image-1.png)

## Host the app at RestAPI.com 
You need to change the setting VITE_URL in .env.production file to point to your Web app url. This is found in the portal at App -> Web app -> General -> Web app url.

- Copy the Web app url value and replace the placeholder in the .env.production file.
- Run `npm run build`
- Zip the contents in the dist folder after the build is finished.
- Go to the File explorer tab in the portal and click on Deploy zip. Then select your zip file from the previous step.
- You should now be able to access the sample app at the web app url.