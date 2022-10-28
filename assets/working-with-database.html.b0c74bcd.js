import{_ as s,o as n,c as a,e as l}from"./app.3f2e9511.js";const p={},o=l(`<h1 id="working-with-database" tabindex="-1"><a class="header-anchor" href="#working-with-database" aria-hidden="true">#</a> Working With Database</h1><h3 id="diesel" tabindex="-1"><a class="header-anchor" href="#diesel" aria-hidden="true">#</a> Diesel</h3><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">diesel</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">prelude</span><span style="color:#D4D4D4;">::*;</span></span>
<span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">diesel</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">r2d2</span><span style="color:#D4D4D4;">::{</span><span style="color:#4EC9B0;">ConnectionManager</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">Pool</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">PoolError</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">PooledConnection</span><span style="color:#D4D4D4;">};</span></span>
<span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">once_cell</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">sync</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">OnceCell</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">salvo</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">prelude</span><span style="color:#D4D4D4;">::*;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#569CD6;">const</span><span style="color:#D4D4D4;"> DB_URL: &amp;</span><span style="color:#4EC9B0;">str</span><span style="color:#D4D4D4;"> = </span><span style="color:#CE9178;">&quot;postgres://benchmarkdbuser:benchmarkdbpass@tfb-database/hello_world&quot;</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"><span style="color:#569CD6;">type</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">PgPool</span><span style="color:#D4D4D4;"> = </span><span style="color:#4EC9B0;">Pool</span><span style="color:#D4D4D4;">&lt;</span><span style="color:#4EC9B0;">ConnectionManager</span><span style="color:#D4D4D4;">&lt;</span><span style="color:#4EC9B0;">PgConnection</span><span style="color:#D4D4D4;">&gt;&gt;;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#569CD6;">static</span><span style="color:#D4D4D4;"> DB_POOL: </span><span style="color:#4EC9B0;">OnceCell</span><span style="color:#D4D4D4;">&lt;</span><span style="color:#4EC9B0;">PgPool</span><span style="color:#D4D4D4;">&gt; = </span><span style="color:#4EC9B0;">OnceCell</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">connect</span><span style="color:#D4D4D4;">() -&gt; </span><span style="color:#4EC9B0;">Result</span><span style="color:#D4D4D4;">&lt;</span><span style="color:#4EC9B0;">PooledConnection</span><span style="color:#D4D4D4;">&lt;</span><span style="color:#4EC9B0;">ConnectionManager</span><span style="color:#D4D4D4;">&lt;</span><span style="color:#4EC9B0;">PgConnection</span><span style="color:#D4D4D4;">&gt;&gt;, </span><span style="color:#4EC9B0;">PoolError</span><span style="color:#D4D4D4;">&gt; {</span></span>
<span class="line"><span style="color:#D4D4D4;">    DB_POOL.</span><span style="color:#DCDCAA;">get</span><span style="color:#D4D4D4;">().</span><span style="color:#DCDCAA;">unwrap</span><span style="color:#D4D4D4;">().</span><span style="color:#DCDCAA;">get</span><span style="color:#D4D4D4;">()</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">build_pool</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">database_url</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#4EC9B0;">str</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">size</span><span style="color:#D4D4D4;">: </span><span style="color:#4EC9B0;">u32</span><span style="color:#D4D4D4;">) -&gt; </span><span style="color:#4EC9B0;">Result</span><span style="color:#D4D4D4;">&lt;</span><span style="color:#4EC9B0;">PgPool</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">PoolError</span><span style="color:#D4D4D4;">&gt; {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">manager</span><span style="color:#D4D4D4;"> = </span><span style="color:#4EC9B0;">ConnectionManager</span><span style="color:#D4D4D4;">::&lt;</span><span style="color:#4EC9B0;">PgConnection</span><span style="color:#D4D4D4;">&gt;::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">database_url</span><span style="color:#D4D4D4;">);</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#4EC9B0;">diesel</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">r2d2</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">Pool</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">builder</span><span style="color:#D4D4D4;">()</span></span>
<span class="line"><span style="color:#D4D4D4;">        .</span><span style="color:#DCDCAA;">max_size</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">size</span><span style="color:#D4D4D4;">)</span></span>
<span class="line"><span style="color:#D4D4D4;">        .</span><span style="color:#DCDCAA;">min_idle</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">Some</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">size</span><span style="color:#D4D4D4;">))</span></span>
<span class="line"><span style="color:#D4D4D4;">        .</span><span style="color:#DCDCAA;">test_on_check_out</span><span style="color:#D4D4D4;">(</span><span style="color:#569CD6;">false</span><span style="color:#D4D4D4;">)</span></span>
<span class="line"><span style="color:#D4D4D4;">        .</span><span style="color:#DCDCAA;">idle_timeout</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">None</span><span style="color:#D4D4D4;">)</span></span>
<span class="line"><span style="color:#D4D4D4;">        .</span><span style="color:#DCDCAA;">max_lifetime</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">None</span><span style="color:#D4D4D4;">)</span></span>
<span class="line"><span style="color:#D4D4D4;">        .</span><span style="color:#DCDCAA;">build</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">manager</span><span style="color:#D4D4D4;">)</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">main</span><span style="color:#D4D4D4;">() {</span></span>
<span class="line"><span style="color:#D4D4D4;">    DB_POOL</span></span>
<span class="line"><span style="color:#D4D4D4;">        .</span><span style="color:#DCDCAA;">set</span><span style="color:#D4D4D4;">(</span><span style="color:#DCDCAA;">build_pool</span><span style="color:#D4D4D4;">(&amp;DB_URL, </span><span style="color:#B5CEA8;">10</span><span style="color:#D4D4D4;">).</span><span style="color:#DCDCAA;">expect</span><span style="color:#D4D4D4;">(&amp;</span><span style="color:#DCDCAA;">format!</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;Error connecting to {}&quot;</span><span style="color:#D4D4D4;">, &amp;DB_URL)))</span></span>
<span class="line"><span style="color:#D4D4D4;">        .</span><span style="color:#DCDCAA;">ok</span><span style="color:#D4D4D4;">();</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">#[handler]</span></span>
<span class="line"><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">show_article</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">req</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Request</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Response</span><span style="color:#D4D4D4;">) -&gt; </span><span style="color:#4EC9B0;">Result</span><span style="color:#D4D4D4;">&lt;(), </span><span style="color:#4EC9B0;">Error</span><span style="color:#D4D4D4;">&gt; {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">id</span><span style="color:#D4D4D4;">: </span><span style="color:#4EC9B0;">i64</span><span style="color:#D4D4D4;"> = </span><span style="color:#9CDCFE;">req</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">param</span><span style="color:#D4D4D4;">::&lt;</span><span style="color:#4EC9B0;">i64</span><span style="color:#D4D4D4;">&gt;(</span><span style="color:#CE9178;">&quot;id&quot;</span><span style="color:#D4D4D4;">).</span><span style="color:#DCDCAA;">unwrap_or_default</span><span style="color:#D4D4D4;">();</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">conn</span><span style="color:#D4D4D4;"> = </span><span style="color:#DCDCAA;">connect</span><span style="color:#D4D4D4;">()?;</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">article</span><span style="color:#D4D4D4;"> = </span><span style="color:#4EC9B0;">articles</span><span style="color:#D4D4D4;">::</span><span style="color:#9CDCFE;">table</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">find</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">id</span><span style="color:#D4D4D4;">).</span><span style="color:#DCDCAA;">first</span><span style="color:#D4D4D4;">::&lt;</span><span style="color:#4EC9B0;">Article</span><span style="color:#D4D4D4;">&gt;(&amp;</span><span style="color:#9CDCFE;">conn</span><span style="color:#D4D4D4;">)?;</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">render</span><span style="color:#D4D4D4;">(</span><span style="color:#DCDCAA;">Json</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">row</span><span style="color:#D4D4D4;">));</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#4EC9B0;">Ok</span><span style="color:#D4D4D4;">(())</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="sqlx" tabindex="-1"><a class="header-anchor" href="#sqlx" aria-hidden="true">#</a> Sqlx</h3><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">sqlx</span><span style="color:#D4D4D4;">::{</span><span style="color:#4EC9B0;">Pool</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">PgPool</span><span style="color:#D4D4D4;">};</span></span>
<span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">once_cell</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">sync</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">OnceCell</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#569CD6;">pub</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">static</span><span style="color:#D4D4D4;"> DB_POOL: </span><span style="color:#4EC9B0;">OnceCell</span><span style="color:#D4D4D4;">&lt;</span><span style="color:#4EC9B0;">PgPool</span><span style="color:#D4D4D4;">&gt; = </span><span style="color:#4EC9B0;">OnceCell</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#569CD6;">pub</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">db_pool</span><span style="color:#D4D4D4;">() -&gt; &amp;</span><span style="color:#4EC9B0;">PgPool</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">    DB_POOL.</span><span style="color:#DCDCAA;">get</span><span style="color:#D4D4D4;">().</span><span style="color:#DCDCAA;">unwrap</span><span style="color:#D4D4D4;">()</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#569CD6;">pub</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">make_db_pool</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">db_url</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#4EC9B0;">str</span><span style="color:#D4D4D4;">) -&gt; </span><span style="color:#4EC9B0;">PgPool</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#4EC9B0;">Pool</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">connect</span><span style="color:#D4D4D4;">(&amp;</span><span style="color:#9CDCFE;">db_url</span><span style="color:#D4D4D4;">).</span><span style="color:#C586C0;">await</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">unwrap</span><span style="color:#D4D4D4;">()</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">#[tokio::main]</span></span>
<span class="line"><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">main</span><span style="color:#D4D4D4;">() {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">pool</span><span style="color:#D4D4D4;"> = </span><span style="color:#DCDCAA;">make_db_pool</span><span style="color:#D4D4D4;">().</span><span style="color:#C586C0;">await</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"><span style="color:#D4D4D4;">    DB_POOL.</span><span style="color:#DCDCAA;">set</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">pool</span><span style="color:#D4D4D4;">).</span><span style="color:#DCDCAA;">unwrap</span><span style="color:#D4D4D4;">();</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="rbatis" tabindex="-1"><a class="header-anchor" href="#rbatis" aria-hidden="true">#</a> rbatis</h3><div class="language-toml line-numbers-mode" data-ext="toml"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#D4D4D4;">[dependencies]</span></span>
<span class="line"><span style="color:#9CDCFE;">async-std</span><span style="color:#D4D4D4;"> = </span><span style="color:#CE9178;">&quot;1.11.0&quot;</span></span>
<span class="line"><span style="color:#9CDCFE;">fast_log</span><span style="color:#D4D4D4;"> = </span><span style="color:#CE9178;">&quot;1.5.24&quot;</span></span>
<span class="line"><span style="color:#9CDCFE;">log</span><span style="color:#D4D4D4;"> = </span><span style="color:#CE9178;">&quot;0.4.17&quot;</span></span>
<span class="line"><span style="color:#9CDCFE;">once_cell</span><span style="color:#D4D4D4;"> = </span><span style="color:#CE9178;">&quot;1.12.0&quot;</span></span>
<span class="line"><span style="color:#9CDCFE;">rbatis</span><span style="color:#D4D4D4;"> = </span><span style="color:#CE9178;">&quot;4.0.7&quot;</span></span>
<span class="line"><span style="color:#9CDCFE;">rbdc</span><span style="color:#D4D4D4;"> = </span><span style="color:#CE9178;">&quot;0.1.2&quot;</span></span>
<span class="line"><span style="color:#9CDCFE;">rbdc-mysql</span><span style="color:#D4D4D4;"> = </span><span style="color:#CE9178;">&quot;0.1.7&quot;</span></span>
<span class="line"><span style="color:#9CDCFE;">rbs</span><span style="color:#D4D4D4;"> = </span><span style="color:#CE9178;">&quot;0.1.2&quot;</span></span>
<span class="line"><span style="color:#9CDCFE;">salvo</span><span style="color:#D4D4D4;"> = { </span><span style="color:#9CDCFE;">path</span><span style="color:#D4D4D4;"> = </span><span style="color:#CE9178;">&quot;../../salvo&quot;</span><span style="color:#D4D4D4;"> }</span></span>
<span class="line"><span style="color:#9CDCFE;">serde</span><span style="color:#D4D4D4;"> = { </span><span style="color:#9CDCFE;">version</span><span style="color:#D4D4D4;"> = </span><span style="color:#CE9178;">&quot;1.0.143&quot;</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">features</span><span style="color:#D4D4D4;"> = [</span><span style="color:#CE9178;">&quot;derive&quot;</span><span style="color:#D4D4D4;">] }</span></span>
<span class="line"><span style="color:#9CDCFE;">tokio</span><span style="color:#D4D4D4;"> = { </span><span style="color:#9CDCFE;">version</span><span style="color:#D4D4D4;"> = </span><span style="color:#CE9178;">&quot;1.20.1&quot;</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">features</span><span style="color:#D4D4D4;"> = [</span><span style="color:#CE9178;">&quot;macros&quot;</span><span style="color:#D4D4D4;">] }</span></span>
<span class="line"><span style="color:#9CDCFE;">tracing</span><span style="color:#D4D4D4;"> = </span><span style="color:#CE9178;">&quot;0.1.36&quot;</span></span>
<span class="line"><span style="color:#9CDCFE;">tracing-subscriber</span><span style="color:#D4D4D4;"> = </span><span style="color:#CE9178;">&quot;0.3.15&quot;</span></span>
<span class="line"><span style="color:#9CDCFE;">serde_json</span><span style="color:#D4D4D4;"> = </span><span style="color:#CE9178;">&quot;1.0&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#D4D4D4;">#[macro_use]</span></span>
<span class="line"><span style="color:#569CD6;">extern</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">crate</span><span style="color:#D4D4D4;"> rbatis;</span></span>
<span class="line"><span style="color:#569CD6;">extern</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">crate</span><span style="color:#D4D4D4;"> rbdc;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">once_cell</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">sync</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">Lazy</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">rbatis</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">Rbatis</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">salvo</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">prelude</span><span style="color:#D4D4D4;">::*;</span></span>
<span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">serde</span><span style="color:#D4D4D4;">::{</span><span style="color:#4EC9B0;">Serialize</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">Deserialize</span><span style="color:#D4D4D4;">};</span></span>
<span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">rbdc_mysql</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">driver</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">MysqlDriver</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#569CD6;">pub</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">static</span><span style="color:#D4D4D4;"> RB: </span><span style="color:#4EC9B0;">Lazy</span><span style="color:#D4D4D4;">&lt;</span><span style="color:#4EC9B0;">Rbatis</span><span style="color:#D4D4D4;">&gt; = </span><span style="color:#4EC9B0;">Lazy</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">(|| </span><span style="color:#4EC9B0;">Rbatis</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">());</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">#[derive(</span><span style="color:#4EC9B0;">Clone</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">Debug</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">Serialize</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">Deserialize</span><span style="color:#D4D4D4;">)]</span></span>
<span class="line"><span style="color:#569CD6;">pub</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">struct</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">User</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">pub</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">id</span><span style="color:#D4D4D4;">: </span><span style="color:#4EC9B0;">i64</span><span style="color:#D4D4D4;">,</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">pub</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">username</span><span style="color:#D4D4D4;">: </span><span style="color:#4EC9B0;">String</span><span style="color:#D4D4D4;">,</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">pub</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">password</span><span style="color:#D4D4D4;">: </span><span style="color:#4EC9B0;">String</span><span style="color:#D4D4D4;">,</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#DCDCAA;">impl_select!</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">User</span><span style="color:#D4D4D4;">{</span><span style="color:#DCDCAA;">select_by_id</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">id</span><span style="color:#D4D4D4;">:</span><span style="color:#4EC9B0;">String</span><span style="color:#D4D4D4;">) -&gt; </span><span style="color:#4EC9B0;">Option</span><span style="color:#D4D4D4;"> =&gt; </span><span style="color:#CE9178;">&quot;\`where id = #{id} limit 1\`&quot;</span><span style="color:#D4D4D4;">});</span></span>
<span class="line"><span style="color:#D4D4D4;">#[handler]</span></span>
<span class="line"><span style="color:#569CD6;">pub</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">get_user</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">req</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Request</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Response</span><span style="color:#D4D4D4;">) {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">uid</span><span style="color:#D4D4D4;"> = </span><span style="color:#9CDCFE;">req</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">query</span><span style="color:#D4D4D4;">::&lt;</span><span style="color:#4EC9B0;">i64</span><span style="color:#D4D4D4;">&gt;(</span><span style="color:#CE9178;">&quot;uid&quot;</span><span style="color:#D4D4D4;">).</span><span style="color:#DCDCAA;">unwrap</span><span style="color:#D4D4D4;">();</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">data</span><span style="color:#D4D4D4;"> = </span><span style="color:#4EC9B0;">User</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">select_by_id</span><span style="color:#D4D4D4;">(&amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> RB.</span><span style="color:#DCDCAA;">clone</span><span style="color:#D4D4D4;">(), </span><span style="color:#9CDCFE;">uid</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">to_string</span><span style="color:#D4D4D4;">()).</span><span style="color:#C586C0;">await</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">unwrap</span><span style="color:#D4D4D4;">();</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#DCDCAA;">println!</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;{:?}&quot;</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">data</span><span style="color:#D4D4D4;">);</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">render</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">serde_json</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">to_string</span><span style="color:#D4D4D4;">(&amp;</span><span style="color:#9CDCFE;">data</span><span style="color:#D4D4D4;">).</span><span style="color:#DCDCAA;">unwrap</span><span style="color:#D4D4D4;">());</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">#[tokio::main]</span></span>
<span class="line"><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">main</span><span style="color:#D4D4D4;">() {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#4EC9B0;">tracing_subscriber</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">fmt</span><span style="color:#D4D4D4;">().</span><span style="color:#DCDCAA;">init</span><span style="color:#D4D4D4;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A9955;">    // mysql connect info</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">mysql_uri</span><span style="color:#D4D4D4;"> = </span><span style="color:#CE9178;">&quot;mysql://root:123456@localhost/test&quot;</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"><span style="color:#D4D4D4;">    RB.</span><span style="color:#DCDCAA;">link</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">MysqlDriver</span><span style="color:#D4D4D4;"> {}, </span><span style="color:#9CDCFE;">mysql_uri</span><span style="color:#D4D4D4;">).</span><span style="color:#C586C0;">await</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">unwrap</span><span style="color:#D4D4D4;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A9955;">    // router</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">router</span><span style="color:#D4D4D4;"> = </span><span style="color:#4EC9B0;">Router</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">with_path</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;users&quot;</span><span style="color:#D4D4D4;">).</span><span style="color:#DCDCAA;">get</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">get_user</span><span style="color:#D4D4D4;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#4EC9B0;">tracing</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">info!</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;Listening on http://127.0.0.1:7878&quot;</span><span style="color:#D4D4D4;">);</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">acceptor</span><span style="color:#D4D4D4;"> = </span><span style="color:#4EC9B0;">TcpListener</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;127.0.0.1:7878&quot;</span><span style="color:#D4D4D4;">).</span><span style="color:#DCDCAA;">bind</span><span style="color:#D4D4D4;">().</span><span style="color:#C586C0;">await</span><span style="color:#D4D4D4;">; </span><span style="color:#4EC9B0;">Server</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">acceptor</span><span style="color:#D4D4D4;">).</span><span style="color:#DCDCAA;">serve</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">router</span><span style="color:#D4D4D4;">).</span><span style="color:#C586C0;">await</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8),e=[o];function D(c,r){return n(),a("div",null,e)}const y=s(p,[["render",D],["__file","working-with-database.html.vue"]]);export{y as default};
