import{_ as s,o as a,c as n,e}from"./app.3f2e9511.js";const l={},o=e(`<h1 id="namedfile" tabindex="-1"><a class="header-anchor" href="#namedfile" aria-hidden="true">#</a> NamedFile</h1><p>Salvo 提供了 <code>salvo::fs::NamedFile</code>, 可以用它高效地发送文件到客户端. 它并不会把文件都加载入缓存, 而是根据请求的 <code>Range</code> 加载部分内容发送至客户端.</p><h2 id="示例代码" tabindex="-1"><a class="header-anchor" href="#示例代码" aria-hidden="true">#</a> 示例代码</h2><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#D4D4D4;">#[handler]</span></span>
<span class="line"><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">send_file</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">req</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Request</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Response</span><span style="color:#D4D4D4;">) {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#4EC9B0;">NamedFile</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">send_file</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;/file/to/path&quot;</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">req</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">).</span><span style="color:#C586C0;">await</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,4),p=[o];function c(r,t){return a(),n("div",null,p)}const i=s(l,[["render",c],["__file","named-file.html.vue"]]);export{i as default};
