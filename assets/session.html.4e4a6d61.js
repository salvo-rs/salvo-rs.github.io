import{_ as s,o as n,c as a,e as l}from"./app.3f2e9511.js";const o={},p=l(`<h1 id="session" tabindex="-1"><a class="header-anchor" href="#session" aria-hidden="true">#</a> Session</h1><p>提供对 <code>Session</code> 支持的中间件.</p><h2 id="配置-cargo-toml" tabindex="-1"><a class="header-anchor" href="#配置-cargo-toml" aria-hidden="true">#</a> 配置 Cargo.toml</h2><div class="language-toml line-numbers-mode" data-ext="toml"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#9CDCFE;">salvo</span><span style="color:#D4D4D4;"> = { </span><span style="color:#9CDCFE;">version</span><span style="color:#D4D4D4;"> = </span><span style="color:#CE9178;">&quot;*&quot;</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">features</span><span style="color:#D4D4D4;"> = [</span><span style="color:#CE9178;">&quot;session&quot;</span><span style="color:#D4D4D4;">] }</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="示例代码" tabindex="-1"><a class="header-anchor" href="#示例代码" aria-hidden="true">#</a> 示例代码</h2><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">salvo</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">prelude</span><span style="color:#D4D4D4;">::*;</span></span>
<span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">salvo</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">session</span><span style="color:#D4D4D4;">::{</span><span style="color:#4EC9B0;">CookieStore</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">Session</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">SessionDepotExt</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">SessionHandler</span><span style="color:#D4D4D4;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">#[tokio::main]</span></span>
<span class="line"><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">main</span><span style="color:#D4D4D4;">() {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#4EC9B0;">tracing_subscriber</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">fmt</span><span style="color:#D4D4D4;">().</span><span style="color:#DCDCAA;">init</span><span style="color:#D4D4D4;">();</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">session_handler</span><span style="color:#D4D4D4;"> = </span><span style="color:#4EC9B0;">SessionHandler</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">builder</span><span style="color:#D4D4D4;">(</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#4EC9B0;">CookieStore</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">(),</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#CE9178;">b&quot;secretabsecretabsecretabsecretabsecretabsecretabsecretabsecretab&quot;</span><span style="color:#D4D4D4;">,</span></span>
<span class="line"><span style="color:#D4D4D4;">    )</span></span>
<span class="line"><span style="color:#D4D4D4;">    .</span><span style="color:#DCDCAA;">build</span><span style="color:#D4D4D4;">()</span></span>
<span class="line"><span style="color:#D4D4D4;">    .</span><span style="color:#DCDCAA;">unwrap</span><span style="color:#D4D4D4;">();</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">router</span><span style="color:#D4D4D4;"> = </span><span style="color:#4EC9B0;">Router</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">()</span></span>
<span class="line"><span style="color:#D4D4D4;">        .</span><span style="color:#DCDCAA;">hoop</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">session_handler</span><span style="color:#D4D4D4;">)</span></span>
<span class="line"><span style="color:#D4D4D4;">        .</span><span style="color:#DCDCAA;">get</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">home</span><span style="color:#D4D4D4;">)</span></span>
<span class="line"><span style="color:#D4D4D4;">        .</span><span style="color:#DCDCAA;">push</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">Router</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">with_path</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;login&quot;</span><span style="color:#D4D4D4;">).</span><span style="color:#DCDCAA;">get</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">login</span><span style="color:#D4D4D4;">).</span><span style="color:#DCDCAA;">post</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">login</span><span style="color:#D4D4D4;">))</span></span>
<span class="line"><span style="color:#D4D4D4;">        .</span><span style="color:#DCDCAA;">push</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">Router</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">with_path</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;logout&quot;</span><span style="color:#D4D4D4;">).</span><span style="color:#DCDCAA;">get</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">logout</span><span style="color:#D4D4D4;">));</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#4EC9B0;">tracing</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">info!</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;Listening on http://127.0.0.1:7878&quot;</span><span style="color:#D4D4D4;">);</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">acceptor</span><span style="color:#D4D4D4;"> = </span><span style="color:#4EC9B0;">TcpListener</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;127.0.0.1:7878&quot;</span><span style="color:#D4D4D4;">).</span><span style="color:#DCDCAA;">bind</span><span style="color:#D4D4D4;">().</span><span style="color:#C586C0;">await</span><span style="color:#D4D4D4;">; </span><span style="color:#4EC9B0;">Server</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">acceptor</span><span style="color:#D4D4D4;">).</span><span style="color:#DCDCAA;">serve</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">router</span><span style="color:#D4D4D4;">).</span><span style="color:#C586C0;">await</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">#[handler]</span></span>
<span class="line"><span style="color:#569CD6;">pub</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">login</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">req</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Request</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">depot</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Depot</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Response</span><span style="color:#D4D4D4;">) {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#C586C0;">if</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">req</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">method</span><span style="color:#D4D4D4;">() == </span><span style="color:#4EC9B0;">salvo</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">http</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">Method</span><span style="color:#D4D4D4;">::POST {</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">session</span><span style="color:#D4D4D4;"> = </span><span style="color:#4EC9B0;">Session</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">();</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#9CDCFE;">session</span></span>
<span class="line"><span style="color:#D4D4D4;">            .</span><span style="color:#DCDCAA;">insert</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;username&quot;</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">req</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">form</span><span style="color:#D4D4D4;">::&lt;</span><span style="color:#4EC9B0;">String</span><span style="color:#D4D4D4;">&gt;(</span><span style="color:#CE9178;">&quot;username&quot;</span><span style="color:#D4D4D4;">).</span><span style="color:#C586C0;">await</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">unwrap</span><span style="color:#D4D4D4;">())</span></span>
<span class="line"><span style="color:#D4D4D4;">            .</span><span style="color:#DCDCAA;">unwrap</span><span style="color:#D4D4D4;">();</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#9CDCFE;">depot</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">set_session</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">session</span><span style="color:#D4D4D4;">);</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">render</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">Redirect</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">other</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;/&quot;</span><span style="color:#D4D4D4;">));</span></span>
<span class="line"><span style="color:#D4D4D4;">    } </span><span style="color:#C586C0;">else</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">render</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">Text</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">Html</span><span style="color:#D4D4D4;">(LOGIN_HTML));</span></span>
<span class="line"><span style="color:#D4D4D4;">    }</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">#[handler]</span></span>
<span class="line"><span style="color:#569CD6;">pub</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">logout</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">depot</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Depot</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Response</span><span style="color:#D4D4D4;">) {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#C586C0;">if</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Some</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">session</span><span style="color:#D4D4D4;">) = </span><span style="color:#9CDCFE;">depot</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">session_mut</span><span style="color:#D4D4D4;">() {</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#9CDCFE;">session</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">remove</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;username&quot;</span><span style="color:#D4D4D4;">);</span></span>
<span class="line"><span style="color:#D4D4D4;">    }</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">render</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">Redirect</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">other</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;/&quot;</span><span style="color:#D4D4D4;">));</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">#[handler]</span></span>
<span class="line"><span style="color:#569CD6;">pub</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">home</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">depot</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Depot</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Response</span><span style="color:#D4D4D4;">) {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">content</span><span style="color:#D4D4D4;"> = </span><span style="color:#CE9178;">r#&quot;&lt;a href=&quot;login&quot;&gt;Login&lt;/h1&gt;&quot;#</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">into</span><span style="color:#D4D4D4;">();</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#C586C0;">if</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Some</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">session</span><span style="color:#D4D4D4;">) = </span><span style="color:#9CDCFE;">depot</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">session_mut</span><span style="color:#D4D4D4;">() {</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#C586C0;">if</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Some</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">username</span><span style="color:#D4D4D4;">) = </span><span style="color:#9CDCFE;">session</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">get</span><span style="color:#D4D4D4;">::&lt;</span><span style="color:#4EC9B0;">String</span><span style="color:#D4D4D4;">&gt;(</span><span style="color:#CE9178;">&quot;username&quot;</span><span style="color:#D4D4D4;">) {</span></span>
<span class="line"><span style="color:#D4D4D4;">            </span><span style="color:#9CDCFE;">content</span><span style="color:#D4D4D4;"> = </span><span style="color:#DCDCAA;">format!</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">r#&quot;Hello, {}. &lt;br&gt;&lt;a href=&quot;logout&quot;&gt;Logout&lt;/h1&gt;&quot;#</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">username</span><span style="color:#D4D4D4;">);</span></span>
<span class="line"><span style="color:#D4D4D4;">        }</span></span>
<span class="line"><span style="color:#D4D4D4;">    }</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">render</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">Text</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">Html</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">content</span><span style="color:#D4D4D4;">));</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#569CD6;">static</span><span style="color:#D4D4D4;"> LOGIN_HTML: &amp;</span><span style="color:#4EC9B0;">str</span><span style="color:#D4D4D4;"> = </span><span style="color:#CE9178;">r#&quot;&lt;!DOCTYPE html&gt;</span></span>
<span class="line"><span style="color:#CE9178;">&lt;html&gt;</span></span>
<span class="line"><span style="color:#CE9178;">    &lt;head&gt;</span></span>
<span class="line"><span style="color:#CE9178;">        &lt;title&gt;Login&lt;/title&gt;</span></span>
<span class="line"><span style="color:#CE9178;">    &lt;/head&gt;</span></span>
<span class="line"><span style="color:#CE9178;">    &lt;body&gt;</span></span>
<span class="line"><span style="color:#CE9178;">        &lt;form action=&quot;/login&quot; method=&quot;post&quot;&gt;</span></span>
<span class="line"><span style="color:#CE9178;">            &lt;h1&gt;Login&lt;/h1&gt;</span></span>
<span class="line"><span style="color:#CE9178;">            &lt;input type=&quot;text&quot; name=&quot;username&quot; /&gt;</span></span>
<span class="line"><span style="color:#CE9178;">            &lt;button type=&quot;submit&quot; id=&quot;submit&quot;&gt;Submit&lt;/button&gt;</span></span>
<span class="line"><span style="color:#CE9178;">        &lt;/form&gt;</span></span>
<span class="line"><span style="color:#CE9178;">    &lt;/body&gt;</span></span>
<span class="line"><span style="color:#CE9178;">&lt;/html&gt;</span></span>
<span class="line"><span style="color:#CE9178;">&quot;#</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,6),e=[p];function D(t,c){return n(),a("div",null,e)}const y=s(o,[["render",D],["__file","session.html.vue"]]);export{y as default};
