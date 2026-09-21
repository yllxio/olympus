import vinext from "vinext";
import {defineConfig} from "vite";
import {cloudflare} from "@cloudflare/vite-plugin";
export default defineConfig({plugins:[vinext(),cloudflare({viteEnvironment:{name:"rsc",childEnvironments:["ssr"]},inspectorPort:false,config:{name:"olympus",main:"vinext/server/fetch-handler",compatibility_date:"2026-05-15",compatibility_flags:["nodejs_compat"],d1_databases:[{binding:"DB",database_name:"olympus",database_id:"00000000-0000-4000-8000-000000000000"}],r2_buckets:[{binding:"BUCKET",bucket_name:"olympus-media"}]}})]});
