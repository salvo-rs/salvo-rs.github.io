import{_ as s,o as n,c as a,e as l}from"./app.3f2e9511.js";const e={},o=l(`<h1 id="cache" tabindex="-1"><a class="header-anchor" href="#cache" aria-hidden="true">#</a> Cache</h1><p>Middleware that provides caching functionality.</p><p>Cache middleware can provide caching function for <code>StatusCode</code>, <code>Headers</code>, <code>Body</code> in <code>Response</code>. For the content that has been cached, when processing the request next time, Cache middleware will directly send the content cached in memory to the client.</p><p>Note that this plugin will not cache <code>Response</code> whose <code>Body</code> is a <code>ResBody::Stream</code>. If applied to a <code>Response</code> of this type, the Cache will not process these requests and will not cause error.</p><h2 id="main-features" tabindex="-1"><a class="header-anchor" href="#main-features" aria-hidden="true">#</a> Main Features</h2><ul><li><p><code>CacheIssuer</code> provides an abstraction over the assigned cache keys. <code>RequestIssuer</code> is an implementation of it that defines which parts of the requested URL and the requested <code>Method</code> to generate a cache key. You can also define your own The logic of cache key generation. The cache key does not have to be a string type, any type that satisfies the constraints of <code>Hash + Eq + Send + Sync + &#39;static</code> can be used as a key.</p></li><li><p><code>CacheStore</code> provides access to data. <code>MemoryStore</code> is a built-in <code>moka</code>-based memory cache implementation. You can also define your own implementation.</p></li><li><p><code>Cache</code> is a structure that implements <code>Handler</code>, and there is a <code>skipper</code> field inside, which can be specified to skip certain requests that do not need to be cached. By default, <code>MethodSkipper</code> will be used to skip all request except <code>Method::GET</code>.</p><p>Internal implementation sample code:</p><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#569CD6;">impl</span><span style="color:#D4D4D4;">&lt;</span><span style="color:#4EC9B0;">S</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">I</span><span style="color:#D4D4D4;">&gt; </span><span style="color:#4EC9B0;">Cache</span><span style="color:#D4D4D4;">&lt;</span><span style="color:#4EC9B0;">S</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">I</span><span style="color:#D4D4D4;">&gt; {</span></span>
<span class="line"><span style="color:#D4D4D4;">  </span><span style="color:#569CD6;">pub</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">store</span><span style="color:#D4D4D4;">: </span><span style="color:#4EC9B0;">S</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">issuer</span><span style="color:#D4D4D4;">: </span><span style="color:#4EC9B0;">I</span><span style="color:#D4D4D4;">) -&gt; </span><span style="color:#569CD6;">Self</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">      </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">skipper</span><span style="color:#D4D4D4;"> = </span><span style="color:#4EC9B0;">MethodSkipper</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">().</span><span style="color:#DCDCAA;">skip_all</span><span style="color:#D4D4D4;">().</span><span style="color:#DCDCAA;">skip_get</span><span style="color:#D4D4D4;">(</span><span style="color:#569CD6;">false</span><span style="color:#D4D4D4;">);</span></span>
<span class="line"><span style="color:#D4D4D4;">      </span><span style="color:#4EC9B0;">Cache</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">          </span><span style="color:#9CDCFE;">store</span><span style="color:#D4D4D4;">,</span></span>
<span class="line"><span style="color:#D4D4D4;">          </span><span style="color:#9CDCFE;">issuer</span><span style="color:#D4D4D4;">,</span></span>
<span class="line"><span style="color:#D4D4D4;">          </span><span style="color:#9CDCFE;">skipper</span><span style="color:#D4D4D4;">: </span><span style="color:#4EC9B0;">Box</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">skipper</span><span style="color:#D4D4D4;">),</span></span>
<span class="line"><span style="color:#D4D4D4;">      }</span></span>
<span class="line"><span style="color:#D4D4D4;">  }</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h2 id="config-cargo-toml" tabindex="-1"><a class="header-anchor" href="#config-cargo-toml" aria-hidden="true">#</a> Config Cargo.toml</h2><div class="language-toml line-numbers-mode" data-ext="toml"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#9CDCFE;">salvo</span><span style="color:#D4D4D4;"> = { </span><span style="color:#9CDCFE;">version</span><span style="color:#D4D4D4;"> = </span><span style="color:#CE9178;">&quot;*&quot;</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">features</span><span style="color:#D4D4D4;"> = [</span><span style="color:#CE9178;">&quot;cache&quot;</span><span style="color:#D4D4D4;">] }</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="sample-code" tabindex="-1"><a class="header-anchor" href="#sample-code" aria-hidden="true">#</a> Sample Code</h2><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">std</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">time</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">Duration</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">salvo</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">prelude</span><span style="color:#D4D4D4;">::*;</span></span>
<span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">salvo</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">writer</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">Text</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">salvo</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">cache</span><span style="color:#D4D4D4;">::{</span><span style="color:#4EC9B0;">Cache</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">MemoryStore</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">RequestIssuer</span><span style="color:#D4D4D4;">};</span></span>
<span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">time</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">OffsetDateTime</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">#[handler]</span></span>
<span class="line"><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">home</span><span style="color:#D4D4D4;">() -&gt; </span><span style="color:#4EC9B0;">Text</span><span style="color:#D4D4D4;">&lt;&amp;&#39;</span><span style="color:#4EC9B0;">static</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">str</span><span style="color:#D4D4D4;">&gt; {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#4EC9B0;">Text</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">Html</span><span style="color:#D4D4D4;">(HOME_HTML)</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"><span style="color:#D4D4D4;">#[handler]</span></span>
<span class="line"><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">short</span><span style="color:#D4D4D4;">() -&gt; </span><span style="color:#4EC9B0;">String</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#DCDCAA;">format!</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;Hello World, my birth time is {}&quot;</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">OffsetDateTime</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">now_utc</span><span style="color:#D4D4D4;">())</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"><span style="color:#D4D4D4;">#[handler]</span></span>
<span class="line"><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">long</span><span style="color:#D4D4D4;">() -&gt; </span><span style="color:#4EC9B0;">String</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#DCDCAA;">format!</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;Hello World, my birth time is {}&quot;</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">OffsetDateTime</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">now_utc</span><span style="color:#D4D4D4;">())</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">#[tokio::main]</span></span>
<span class="line"><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">main</span><span style="color:#D4D4D4;">() {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#4EC9B0;">tracing_subscriber</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">fmt</span><span style="color:#D4D4D4;">().</span><span style="color:#DCDCAA;">init</span><span style="color:#D4D4D4;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#4EC9B0;">tracing</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">info!</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;Listening on http://127.0.0.1:7878&quot;</span><span style="color:#D4D4D4;">);</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">short_cache</span><span style="color:#D4D4D4;"> = </span><span style="color:#4EC9B0;">Cache</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">(</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#4EC9B0;">MemoryStore</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">builder</span><span style="color:#D4D4D4;">().</span><span style="color:#DCDCAA;">time_to_live</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">Duration</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">from_secs</span><span style="color:#D4D4D4;">(</span><span style="color:#B5CEA8;">5</span><span style="color:#D4D4D4;">)).</span><span style="color:#DCDCAA;">build</span><span style="color:#D4D4D4;">(),</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#4EC9B0;">RequestIssuer</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">default</span><span style="color:#D4D4D4;">(),</span></span>
<span class="line"><span style="color:#D4D4D4;">    );</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">long_cache</span><span style="color:#D4D4D4;"> = </span><span style="color:#4EC9B0;">Cache</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">(</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#4EC9B0;">MemoryStore</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">builder</span><span style="color:#D4D4D4;">().</span><span style="color:#DCDCAA;">time_to_live</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">Duration</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">from_secs</span><span style="color:#D4D4D4;">(</span><span style="color:#B5CEA8;">60</span><span style="color:#D4D4D4;">)).</span><span style="color:#DCDCAA;">build</span><span style="color:#D4D4D4;">(),</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#4EC9B0;">RequestIssuer</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">default</span><span style="color:#D4D4D4;">(),</span></span>
<span class="line"><span style="color:#D4D4D4;">    );</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">router</span><span style="color:#D4D4D4;"> = </span><span style="color:#4EC9B0;">Router</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">()</span></span>
<span class="line"><span style="color:#D4D4D4;">        .</span><span style="color:#DCDCAA;">get</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">home</span><span style="color:#D4D4D4;">)</span></span>
<span class="line"><span style="color:#D4D4D4;">        .</span><span style="color:#DCDCAA;">push</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">Router</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">with_path</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;short&quot;</span><span style="color:#D4D4D4;">).</span><span style="color:#DCDCAA;">hoop</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">short_cache</span><span style="color:#D4D4D4;">).</span><span style="color:#DCDCAA;">get</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">short</span><span style="color:#D4D4D4;">))</span></span>
<span class="line"><span style="color:#D4D4D4;">        .</span><span style="color:#DCDCAA;">push</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">Router</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">with_path</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;long&quot;</span><span style="color:#D4D4D4;">).</span><span style="color:#DCDCAA;">hoop</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">long_cache</span><span style="color:#D4D4D4;">).</span><span style="color:#DCDCAA;">get</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">long</span><span style="color:#D4D4D4;">));</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">acceptor</span><span style="color:#D4D4D4;"> = </span><span style="color:#4EC9B0;">TcpListener</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;127.0.0.1:7878&quot;</span><span style="color:#D4D4D4;">).</span><span style="color:#DCDCAA;">bind</span><span style="color:#D4D4D4;">().</span><span style="color:#C586C0;">await</span><span style="color:#D4D4D4;">; </span><span style="color:#4EC9B0;">Server</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">acceptor</span><span style="color:#D4D4D4;">).</span><span style="color:#DCDCAA;">serve</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">router</span><span style="color:#D4D4D4;">).</span><span style="color:#C586C0;">await</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#569CD6;">static</span><span style="color:#D4D4D4;"> HOME_HTML: &amp;</span><span style="color:#4EC9B0;">str</span><span style="color:#D4D4D4;"> = </span><span style="color:#CE9178;">r#&quot;</span></span>
<span class="line"><span style="color:#CE9178;">&lt;!DOCTYPE html&gt;</span></span>
<span class="line"><span style="color:#CE9178;">&lt;html&gt;</span></span>
<span class="line"><span style="color:#CE9178;">    &lt;head&gt;</span></span>
<span class="line"><span style="color:#CE9178;">        &lt;title&gt;Cache Example&lt;/title&gt;</span></span>
<span class="line"><span style="color:#CE9178;">    &lt;/head&gt;</span></span>
<span class="line"><span style="color:#CE9178;">    &lt;body&gt;</span></span>
<span class="line"><span style="color:#CE9178;">        &lt;h2&gt;Cache Example&lt;/h2&gt;</span></span>
<span class="line"><span style="color:#CE9178;">        &lt;p&gt;</span></span>
<span class="line"><span style="color:#CE9178;">            This examples shows how to use cache middleware. </span></span>
<span class="line"><span style="color:#CE9178;">        &lt;/p&gt;</span></span>
<span class="line"><span style="color:#CE9178;">        &lt;p&gt;</span></span>
<span class="line"><span style="color:#CE9178;">            &lt;a href=&quot;/short&quot; target=&quot;_blank&quot;&gt;Cache 5 seconds&lt;/a&gt;</span></span>
<span class="line"><span style="color:#CE9178;">        &lt;/p&gt;</span></span>
<span class="line"><span style="color:#CE9178;">        &lt;p&gt;</span></span>
<span class="line"><span style="color:#CE9178;">            &lt;a href=&quot;/long&quot; target=&quot;_blank&quot;&gt;Cache 1 minute&lt;/a&gt;</span></span>
<span class="line"><span style="color:#CE9178;">        &lt;/p&gt;</span></span>
<span class="line"><span style="color:#CE9178;">    &lt;/body&gt;</span></span>
<span class="line"><span style="color:#CE9178;">&lt;/html&gt;</span></span>
<span class="line"><span style="color:#CE9178;">&quot;#</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,10),p=[o];function c(D,t){return n(),a("div",null,p)}const i=s(e,[["render",c],["__file","cache.html.vue"]]);export{i as default};
