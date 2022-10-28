import{_ as s,o as n,c as a,e as l}from"./app.3f2e9511.js";const p={},o=l(`<h1 id="jwt-auth" tabindex="-1"><a class="header-anchor" href="#jwt-auth" aria-hidden="true">#</a> JWT Auth</h1><p>提供对 JWT Auth 验证的中间件.</p><h2 id="配置-cargo-toml" tabindex="-1"><a class="header-anchor" href="#配置-cargo-toml" aria-hidden="true">#</a> 配置 Cargo.toml</h2><div class="language-toml line-numbers-mode" data-ext="toml"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#9CDCFE;">salvo</span><span style="color:#D4D4D4;"> = { </span><span style="color:#9CDCFE;">version</span><span style="color:#D4D4D4;"> = </span><span style="color:#CE9178;">&quot;*&quot;</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">features</span><span style="color:#D4D4D4;"> = [</span><span style="color:#CE9178;">&quot;jwt-auth&quot;</span><span style="color:#D4D4D4;">] }</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="示例代码" tabindex="-1"><a class="header-anchor" href="#示例代码" aria-hidden="true">#</a> 示例代码</h2><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">jsonwebtoken</span><span style="color:#D4D4D4;">::{</span><span style="color:#569CD6;">self</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">EncodingKey</span><span style="color:#D4D4D4;">};</span></span>
<span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">salvo</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">http</span><span style="color:#D4D4D4;">::{</span><span style="color:#4EC9B0;">Method</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">StatusError</span><span style="color:#D4D4D4;">};</span></span>
<span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">salvo</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">jwt_auth</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">QueryFinder</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">salvo</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">prelude</span><span style="color:#D4D4D4;">::*;</span></span>
<span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">serde</span><span style="color:#D4D4D4;">::{</span><span style="color:#4EC9B0;">Deserialize</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">Serialize</span><span style="color:#D4D4D4;">};</span></span>
<span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">time</span><span style="color:#D4D4D4;">::{</span><span style="color:#4EC9B0;">Duration</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">OffsetDateTime</span><span style="color:#D4D4D4;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#569CD6;">const</span><span style="color:#D4D4D4;"> SECRET_KEY: &amp;</span><span style="color:#4EC9B0;">str</span><span style="color:#D4D4D4;"> = </span><span style="color:#CE9178;">&quot;YOUR SECRET_KEY&quot;</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">#[derive(</span><span style="color:#4EC9B0;">Debug</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">Serialize</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">Deserialize</span><span style="color:#D4D4D4;">)]</span></span>
<span class="line"><span style="color:#569CD6;">pub</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">struct</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">JwtClaims</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#9CDCFE;">username</span><span style="color:#D4D4D4;">: </span><span style="color:#4EC9B0;">String</span><span style="color:#D4D4D4;">,</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#9CDCFE;">exp</span><span style="color:#D4D4D4;">: </span><span style="color:#4EC9B0;">i64</span><span style="color:#D4D4D4;">,</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">#[tokio::main]</span></span>
<span class="line"><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">main</span><span style="color:#D4D4D4;">() {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#4EC9B0;">tracing_subscriber</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">fmt</span><span style="color:#D4D4D4;">().</span><span style="color:#DCDCAA;">init</span><span style="color:#D4D4D4;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">auth_handler</span><span style="color:#D4D4D4;">: </span><span style="color:#4EC9B0;">JwtAuth</span><span style="color:#D4D4D4;">&lt;</span><span style="color:#4EC9B0;">JwtClaims</span><span style="color:#D4D4D4;">&gt; = </span><span style="color:#4EC9B0;">JwtAuth</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">(SECRET_KEY.</span><span style="color:#DCDCAA;">to_owned</span><span style="color:#D4D4D4;">())</span></span>
<span class="line"><span style="color:#D4D4D4;">        .</span><span style="color:#DCDCAA;">with_finders</span><span style="color:#D4D4D4;">(</span><span style="color:#DCDCAA;">vec!</span><span style="color:#D4D4D4;">[</span></span>
<span class="line"><span style="color:#6A9955;">            // Box::new(HeaderFinder::new()),</span></span>
<span class="line"><span style="color:#D4D4D4;">            </span><span style="color:#4EC9B0;">Box</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">QueryFinder</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;jwt_token&quot;</span><span style="color:#D4D4D4;">)),</span></span>
<span class="line"><span style="color:#6A9955;">            // Box::new(CookieFinder::new(&quot;jwt_token&quot;)),</span></span>
<span class="line"><span style="color:#D4D4D4;">        ])</span></span>
<span class="line"><span style="color:#D4D4D4;">        .</span><span style="color:#DCDCAA;">with_response_error</span><span style="color:#D4D4D4;">(</span><span style="color:#569CD6;">false</span><span style="color:#D4D4D4;">);</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#4EC9B0;">tracing</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">info!</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;Listening on http://127.0.0.1:7878&quot;</span><span style="color:#D4D4D4;">);</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">acceptor</span><span style="color:#D4D4D4;"> = </span><span style="color:#4EC9B0;">TcpListener</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;127.0.0.1:7878&quot;</span><span style="color:#D4D4D4;">).</span><span style="color:#DCDCAA;">bind</span><span style="color:#D4D4D4;">().</span><span style="color:#C586C0;">await</span><span style="color:#D4D4D4;">; </span><span style="color:#4EC9B0;">Server</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">acceptor</span><span style="color:#D4D4D4;">)</span></span>
<span class="line"><span style="color:#D4D4D4;">        .</span><span style="color:#DCDCAA;">serve</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">Router</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">with_hoop</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">auth_handler</span><span style="color:#D4D4D4;">).</span><span style="color:#DCDCAA;">handle</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">index</span><span style="color:#D4D4D4;">))</span></span>
<span class="line"><span style="color:#D4D4D4;">        .</span><span style="color:#C586C0;">await</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"><span style="color:#D4D4D4;">#[handler]</span></span>
<span class="line"><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">index</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">req</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Request</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">depot</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Depot</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Response</span><span style="color:#D4D4D4;">) -&gt; </span><span style="color:#4EC9B0;">anyhow</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">Result</span><span style="color:#D4D4D4;">&lt;()&gt; {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#C586C0;">if</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">req</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">method</span><span style="color:#D4D4D4;">() == </span><span style="color:#4EC9B0;">Method</span><span style="color:#D4D4D4;">::POST {</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> (</span><span style="color:#9CDCFE;">username</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">password</span><span style="color:#D4D4D4;">) = (</span></span>
<span class="line"><span style="color:#D4D4D4;">            </span><span style="color:#9CDCFE;">req</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">form</span><span style="color:#D4D4D4;">::&lt;</span><span style="color:#4EC9B0;">String</span><span style="color:#D4D4D4;">&gt;(</span><span style="color:#CE9178;">&quot;username&quot;</span><span style="color:#D4D4D4;">).</span><span style="color:#C586C0;">await</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">unwrap_or_default</span><span style="color:#D4D4D4;">(),</span></span>
<span class="line"><span style="color:#D4D4D4;">            </span><span style="color:#9CDCFE;">req</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">form</span><span style="color:#D4D4D4;">::&lt;</span><span style="color:#4EC9B0;">String</span><span style="color:#D4D4D4;">&gt;(</span><span style="color:#CE9178;">&quot;password&quot;</span><span style="color:#D4D4D4;">).</span><span style="color:#C586C0;">await</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">unwrap_or_default</span><span style="color:#D4D4D4;">(),</span></span>
<span class="line"><span style="color:#D4D4D4;">        );</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#C586C0;">if</span><span style="color:#D4D4D4;"> !</span><span style="color:#DCDCAA;">validate</span><span style="color:#D4D4D4;">(&amp;</span><span style="color:#9CDCFE;">username</span><span style="color:#D4D4D4;">, &amp;</span><span style="color:#9CDCFE;">password</span><span style="color:#D4D4D4;">) {</span></span>
<span class="line"><span style="color:#D4D4D4;">            </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">render</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">Text</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">Html</span><span style="color:#D4D4D4;">(LOGIN_HTML));</span></span>
<span class="line"><span style="color:#D4D4D4;">            </span><span style="color:#C586C0;">return</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Ok</span><span style="color:#D4D4D4;">(());</span></span>
<span class="line"><span style="color:#D4D4D4;">        }</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">exp</span><span style="color:#D4D4D4;"> = </span><span style="color:#4EC9B0;">OffsetDateTime</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">now_utc</span><span style="color:#D4D4D4;">() + </span><span style="color:#4EC9B0;">Duration</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">days</span><span style="color:#D4D4D4;">(</span><span style="color:#B5CEA8;">14</span><span style="color:#D4D4D4;">);</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">claim</span><span style="color:#D4D4D4;"> = </span><span style="color:#4EC9B0;">JwtClaims</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">            </span><span style="color:#9CDCFE;">username</span><span style="color:#D4D4D4;">,</span></span>
<span class="line"><span style="color:#D4D4D4;">            </span><span style="color:#9CDCFE;">exp</span><span style="color:#D4D4D4;">: </span><span style="color:#9CDCFE;">exp</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">unix_timestamp</span><span style="color:#D4D4D4;">(),</span></span>
<span class="line"><span style="color:#D4D4D4;">        };</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">token</span><span style="color:#D4D4D4;"> = </span><span style="color:#4EC9B0;">jsonwebtoken</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">encode</span><span style="color:#D4D4D4;">(</span></span>
<span class="line"><span style="color:#D4D4D4;">            &amp;</span><span style="color:#4EC9B0;">jsonwebtoken</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">Header</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">default</span><span style="color:#D4D4D4;">(),</span></span>
<span class="line"><span style="color:#D4D4D4;">            &amp;</span><span style="color:#9CDCFE;">claim</span><span style="color:#D4D4D4;">,</span></span>
<span class="line"><span style="color:#D4D4D4;">            &amp;</span><span style="color:#4EC9B0;">EncodingKey</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">from_secret</span><span style="color:#D4D4D4;">(SECRET_KEY.</span><span style="color:#DCDCAA;">as_bytes</span><span style="color:#D4D4D4;">()),</span></span>
<span class="line"><span style="color:#D4D4D4;">        )?;</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">render</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">Redirect</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">other</span><span style="color:#D4D4D4;">(&amp;</span><span style="color:#DCDCAA;">format!</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;/?jwt_token={}&quot;</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">token</span><span style="color:#D4D4D4;">)));</span></span>
<span class="line"><span style="color:#D4D4D4;">    } </span><span style="color:#C586C0;">else</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#C586C0;">match</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">depot</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">jwt_auth_state</span><span style="color:#D4D4D4;">() {</span></span>
<span class="line"><span style="color:#D4D4D4;">            </span><span style="color:#4EC9B0;">JwtAuthState</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">Authorized</span><span style="color:#D4D4D4;"> =&gt; {</span></span>
<span class="line"><span style="color:#D4D4D4;">                </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">data</span><span style="color:#D4D4D4;"> = </span><span style="color:#9CDCFE;">depot</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">jwt_auth_data</span><span style="color:#D4D4D4;">::&lt;</span><span style="color:#4EC9B0;">JwtClaims</span><span style="color:#D4D4D4;">&gt;().</span><span style="color:#DCDCAA;">unwrap</span><span style="color:#D4D4D4;">();</span></span>
<span class="line"><span style="color:#D4D4D4;">                </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">render</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">Text</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">Plain</span><span style="color:#D4D4D4;">(</span><span style="color:#DCDCAA;">format!</span><span style="color:#D4D4D4;">(</span></span>
<span class="line"><span style="color:#D4D4D4;">                    </span><span style="color:#CE9178;">&quot;Hi {}, have logged in successfully!&quot;</span><span style="color:#D4D4D4;">,</span></span>
<span class="line"><span style="color:#D4D4D4;">                    </span><span style="color:#9CDCFE;">data</span><span style="color:#D4D4D4;">.claims.username</span></span>
<span class="line"><span style="color:#D4D4D4;">                )));</span></span>
<span class="line"><span style="color:#D4D4D4;">            }</span></span>
<span class="line"><span style="color:#D4D4D4;">            </span><span style="color:#4EC9B0;">JwtAuthState</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">Unauthorized</span><span style="color:#D4D4D4;"> =&gt; {</span></span>
<span class="line"><span style="color:#D4D4D4;">                </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">render</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">Text</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">Html</span><span style="color:#D4D4D4;">(LOGIN_HTML));</span></span>
<span class="line"><span style="color:#D4D4D4;">            }</span></span>
<span class="line"><span style="color:#D4D4D4;">            </span><span style="color:#4EC9B0;">JwtAuthState</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">Forbidden</span><span style="color:#D4D4D4;"> =&gt; {</span></span>
<span class="line"><span style="color:#D4D4D4;">                </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">set_status_error</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">StatusError</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">forbidden</span><span style="color:#D4D4D4;">());</span></span>
<span class="line"><span style="color:#D4D4D4;">            }</span></span>
<span class="line"><span style="color:#D4D4D4;">        }</span></span>
<span class="line"><span style="color:#D4D4D4;">    }</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#4EC9B0;">Ok</span><span style="color:#D4D4D4;">(())</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">validate</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">username</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#4EC9B0;">str</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">password</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#4EC9B0;">str</span><span style="color:#D4D4D4;">) -&gt; </span><span style="color:#4EC9B0;">bool</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#9CDCFE;">username</span><span style="color:#D4D4D4;"> == </span><span style="color:#CE9178;">&quot;root&quot;</span><span style="color:#D4D4D4;"> &amp;&amp; </span><span style="color:#9CDCFE;">password</span><span style="color:#D4D4D4;"> == </span><span style="color:#CE9178;">&quot;pwd&quot;</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#569CD6;">static</span><span style="color:#D4D4D4;"> LOGIN_HTML: &amp;</span><span style="color:#4EC9B0;">str</span><span style="color:#D4D4D4;"> = </span><span style="color:#CE9178;">r#&quot;&lt;!DOCTYPE html&gt;</span></span>
<span class="line"><span style="color:#CE9178;">&lt;html&gt;</span></span>
<span class="line"><span style="color:#CE9178;">    &lt;head&gt;</span></span>
<span class="line"><span style="color:#CE9178;">        &lt;title&gt;JWT Auth Demo&lt;/title&gt;</span></span>
<span class="line"><span style="color:#CE9178;">    &lt;/head&gt;</span></span>
<span class="line"><span style="color:#CE9178;">    &lt;body&gt;</span></span>
<span class="line"><span style="color:#CE9178;">        &lt;h1&gt;JWT Auth&lt;/h1&gt;</span></span>
<span class="line"><span style="color:#CE9178;">        &lt;form action=&quot;/&quot; method=&quot;post&quot;&gt;</span></span>
<span class="line"><span style="color:#CE9178;">        &lt;label for=&quot;username&quot;&gt;&lt;b&gt;Username&lt;/b&gt;&lt;/label&gt;</span></span>
<span class="line"><span style="color:#CE9178;">        &lt;input type=&quot;text&quot; placeholder=&quot;Enter Username&quot; name=&quot;username&quot; required&gt;</span></span>
<span class="line"><span style="color:#CE9178;">    </span></span>
<span class="line"><span style="color:#CE9178;">        &lt;label for=&quot;password&quot;&gt;&lt;b&gt;Password&lt;/b&gt;&lt;/label&gt;</span></span>
<span class="line"><span style="color:#CE9178;">        &lt;input type=&quot;password&quot; placeholder=&quot;Enter Password&quot; name=&quot;password&quot; required&gt;</span></span>
<span class="line"><span style="color:#CE9178;">    </span></span>
<span class="line"><span style="color:#CE9178;">        &lt;button type=&quot;submit&quot;&gt;Login&lt;/button&gt;</span></span>
<span class="line"><span style="color:#CE9178;">    &lt;/form&gt;</span></span>
<span class="line"><span style="color:#CE9178;">    &lt;/body&gt;</span></span>
<span class="line"><span style="color:#CE9178;">&lt;/html&gt;</span></span>
<span class="line"><span style="color:#CE9178;">&quot;#</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,6),e=[o];function D(t,r){return n(),a("div",null,e)}const i=s(p,[["render",D],["__file","jwt-auth.html.vue"]]);export{i as default};
