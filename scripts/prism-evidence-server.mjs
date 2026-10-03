/** Local-only evidence receiver. Browser interaction stays in the Codex browser. */
import { createServer } from 'node:http';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const destination = new URL('../.worknotes/browser-evidence/', import.meta.url);
await mkdir(destination,{recursive:true});
const page = `<!doctype html><html lang="ko"><meta charset="utf-8"><title>PRISM browser evidence</title><style>body{font:16px system-ui;margin:24px}textarea{display:block;width:95%;height:300px}button{margin-top:16px}output{display:block;margin:16px 0}</style><h1>PRISM 브라우저 검증 기록</h1><form><label for="evidence">검증 JSON</label><textarea id="evidence"></textarea><button>기록 저장</button></form><output role="status"></output><script>document.querySelector('form').onsubmit=async e=>{e.preventDefault();const output=document.querySelector('output');try{const response=await fetch('/evidence',{method:'POST',headers:{'Content-Type':'application/json'},body:document.querySelector('textarea').value});const data=await response.json();output.textContent=response.ok?'저장 완료: '+data.name:'저장 실패: '+data.error;}catch{output.textContent='저장 실패';}};</script></html>`;
const server = createServer(async (request,response) => {
    if (request.method === 'GET' && request.url === '/') { response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});response.end(page);return; }
    const origin = request.headers.origin;
    if (request.method !== 'POST' || request.url !== '/evidence' || origin !== 'http://127.0.0.1:5804') {response.writeHead(403);response.end();return;}
    try {
        let body=''; for await (const chunk of request) {body+=chunk;if(body.length>12*1024*1024)throw new Error('Record too large');}
        const {name,screenshot,...record}=JSON.parse(body);
        if (!/^[a-z0-9-]{1,100}$/.test(name)) throw new Error('Invalid record name');
        await writeFile(join(destination.pathname,name+'.json'),JSON.stringify(record,null,2)+'\n');
        if (screenshot) { const bytes=Buffer.from(screenshot,'base64'); if(bytes[0]!==0xff || bytes[1]!==0xd8)throw new Error('JPEG required'); await writeFile(join(destination.pathname,name+'.jpg'),bytes); }
        response.writeHead(200,{'Content-Type':'application/json'});response.end(JSON.stringify({name}));
    } catch(error) {response.writeHead(400,{'Content-Type':'application/json'});response.end(JSON.stringify({error:error.message}));}
});
server.listen(5804,'127.0.0.1',()=>console.log('Local evidence receiver: http://127.0.0.1:5804'));
