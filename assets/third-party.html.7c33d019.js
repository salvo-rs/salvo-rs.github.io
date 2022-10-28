import{_ as l,r as p,o,c as e,b as s,d as n,a as D,e as r}from"./app.3f2e9511.js";const c={},t=r(`<h1 id="第三方插件" tabindex="-1"><a class="header-anchor" href="#第三方插件" aria-hidden="true">#</a> 第三方插件</h1><h2 id="salvo-websocket" tabindex="-1"><a class="header-anchor" href="#salvo-websocket" aria-hidden="true">#</a> salvo-websocket</h2><h3 id="添加項目依賴" tabindex="-1"><a class="header-anchor" href="#添加項目依賴" aria-hidden="true">#</a> 添加項目依賴</h3><div class="language-toml line-numbers-mode" data-ext="toml"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#D4D4D4;">[dependencies]</span></span>
<span class="line"><span style="color:#9CDCFE;">salvo-websocket</span><span style="color:#D4D4D4;"> = </span><span style="color:#CE9178;">&quot;0.0.4&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="定義-ws-連接時的-query-params" tabindex="-1"><a class="header-anchor" href="#定義-ws-連接時的-query-params" aria-hidden="true">#</a> 定義 ws 連接時的 query params</h3><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#D4D4D4;">#[derive(</span><span style="color:#4EC9B0;">Debug</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">Clone</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">Deserialize</span><span style="color:#D4D4D4;">)]</span></span>
<span class="line"><span style="color:#569CD6;">struct</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">User</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#9CDCFE;">name</span><span style="color:#D4D4D4;">: </span><span style="color:#4EC9B0;">String</span><span style="color:#D4D4D4;">,</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#9CDCFE;">room</span><span style="color:#D4D4D4;">: </span><span style="color:#4EC9B0;">String</span><span style="color:#D4D4D4;">,</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="實現-websockethandler-trait" tabindex="-1"><a class="header-anchor" href="#實現-websockethandler-trait" aria-hidden="true">#</a> 實現 WebSocketHandler trait</h3><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#569CD6;">impl</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">WebSocketHandler</span><span style="color:#D4D4D4;"> </span><span style="color:#C586C0;">for</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">User</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#6A9955;">    // 連接事件</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">on_connected</span><span style="color:#D4D4D4;">(&amp;</span><span style="color:#569CD6;">self</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">ws_id</span><span style="color:#D4D4D4;">: </span><span style="color:#4EC9B0;">usize</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">sender</span><span style="color:#D4D4D4;">: </span><span style="color:#4EC9B0;">UnboundedSender</span><span style="color:#D4D4D4;">&lt;</span><span style="color:#4EC9B0;">Result</span><span style="color:#D4D4D4;">&lt;</span><span style="color:#4EC9B0;">Message</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">Error</span><span style="color:#D4D4D4;">&gt;&gt;) {</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#4EC9B0;">tracing</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">info!</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;{} connected&quot;</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">ws_id</span><span style="color:#D4D4D4;">);</span></span>
<span class="line"><span style="color:#D4D4D4;">        WS_CONTROLLER.</span><span style="color:#DCDCAA;">write</span><span style="color:#D4D4D4;">().</span><span style="color:#C586C0;">await</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">join_group</span><span style="color:#D4D4D4;">(</span><span style="color:#569CD6;">self</span><span style="color:#D4D4D4;">.room.</span><span style="color:#DCDCAA;">clone</span><span style="color:#D4D4D4;">(), </span><span style="color:#9CDCFE;">sender</span><span style="color:#D4D4D4;">).</span><span style="color:#DCDCAA;">unwrap</span><span style="color:#D4D4D4;">();</span></span>
<span class="line"><span style="color:#D4D4D4;">        WS_CONTROLLER.</span><span style="color:#DCDCAA;">write</span><span style="color:#D4D4D4;">().</span><span style="color:#C586C0;">await</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">send_group</span><span style="color:#D4D4D4;">(</span></span>
<span class="line"><span style="color:#D4D4D4;">            </span><span style="color:#569CD6;">self</span><span style="color:#D4D4D4;">.room.</span><span style="color:#DCDCAA;">clone</span><span style="color:#D4D4D4;">(),</span></span>
<span class="line"><span style="color:#D4D4D4;">            </span><span style="color:#4EC9B0;">Message</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">text</span><span style="color:#D4D4D4;">(</span><span style="color:#DCDCAA;">format!</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;{:?} joined!&quot;</span><span style="color:#D4D4D4;">, </span><span style="color:#569CD6;">self</span><span style="color:#D4D4D4;">.name)</span></span>
<span class="line"><span style="color:#D4D4D4;">            ),</span></span>
<span class="line"><span style="color:#D4D4D4;">        ).</span><span style="color:#DCDCAA;">unwrap</span><span style="color:#D4D4D4;">();</span></span>
<span class="line"><span style="color:#D4D4D4;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A9955;">    // 斷連事件</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">on_disconnected</span><span style="color:#D4D4D4;">(&amp;</span><span style="color:#569CD6;">self</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">ws_id</span><span style="color:#D4D4D4;">: </span><span style="color:#4EC9B0;">usize</span><span style="color:#D4D4D4;">) {</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#4EC9B0;">tracing</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">info!</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;{} disconnected&quot;</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">ws_id</span><span style="color:#D4D4D4;">);</span></span>
<span class="line"><span style="color:#D4D4D4;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A9955;">    // 接收消息事件</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">on_receive_message</span><span style="color:#D4D4D4;">(&amp;</span><span style="color:#569CD6;">self</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">msg</span><span style="color:#D4D4D4;">: </span><span style="color:#4EC9B0;">Message</span><span style="color:#D4D4D4;">) {</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#4EC9B0;">tracing</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">info!</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;{:?} received&quot;</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">msg</span><span style="color:#D4D4D4;">);</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">msg</span><span style="color:#D4D4D4;"> = </span><span style="color:#C586C0;">if</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Ok</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">s</span><span style="color:#D4D4D4;">) = </span><span style="color:#9CDCFE;">msg</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">to_str</span><span style="color:#D4D4D4;">() {</span></span>
<span class="line"><span style="color:#D4D4D4;">            </span><span style="color:#9CDCFE;">s</span></span>
<span class="line"><span style="color:#D4D4D4;">        } </span><span style="color:#C586C0;">else</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">            </span><span style="color:#C586C0;">return</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"><span style="color:#D4D4D4;">        };</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">new_msg</span><span style="color:#D4D4D4;"> = </span><span style="color:#DCDCAA;">format!</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;&lt;User#{}&gt;: {}&quot;</span><span style="color:#D4D4D4;">, </span><span style="color:#569CD6;">self</span><span style="color:#D4D4D4;">.name, </span><span style="color:#9CDCFE;">msg</span><span style="color:#D4D4D4;">);</span></span>
<span class="line"><span style="color:#D4D4D4;">        WS_CONTROLLER.</span><span style="color:#DCDCAA;">write</span><span style="color:#D4D4D4;">().</span><span style="color:#C586C0;">await</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">send_group</span><span style="color:#D4D4D4;">(</span><span style="color:#569CD6;">self</span><span style="color:#D4D4D4;">.room.</span><span style="color:#DCDCAA;">clone</span><span style="color:#D4D4D4;">(), </span><span style="color:#4EC9B0;">Message</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">text</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">new_msg</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">clone</span><span style="color:#D4D4D4;">())).</span><span style="color:#DCDCAA;">unwrap</span><span style="color:#D4D4D4;">();</span></span>
<span class="line"><span style="color:#D4D4D4;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">on_send_message</span><span style="color:#D4D4D4;">(&amp;</span><span style="color:#569CD6;">self</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">msg</span><span style="color:#D4D4D4;">: </span><span style="color:#4EC9B0;">Message</span><span style="color:#D4D4D4;">) -&gt; </span><span style="color:#4EC9B0;">Result</span><span style="color:#D4D4D4;">&lt;</span><span style="color:#4EC9B0;">Message</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">Error</span><span style="color:#D4D4D4;">&gt; {</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#4EC9B0;">tracing</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">info!</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;{:?} sending&quot;</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">msg</span><span style="color:#D4D4D4;">);</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#4EC9B0;">Ok</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">msg</span><span style="color:#D4D4D4;">)</span></span>
<span class="line"><span style="color:#D4D4D4;">    }</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="編寫連接處理方法" tabindex="-1"><a class="header-anchor" href="#編寫連接處理方法" aria-hidden="true">#</a> 編寫連接處理方法</h3><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#D4D4D4;">#[tokio::main]</span></span>
<span class="line"><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">main</span><span style="color:#D4D4D4;">() {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#4EC9B0;">tracing_subscriber</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">fmt</span><span style="color:#D4D4D4;">().</span><span style="color:#DCDCAA;">init</span><span style="color:#D4D4D4;">();</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">router</span><span style="color:#D4D4D4;"> = </span><span style="color:#4EC9B0;">Router</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">()</span></span>
<span class="line"><span style="color:#D4D4D4;">        .</span><span style="color:#DCDCAA;">push</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">Router</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">with_path</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;chat&quot;</span><span style="color:#D4D4D4;">).</span><span style="color:#DCDCAA;">handle</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">user_connected</span><span style="color:#D4D4D4;">));</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#4EC9B0;">tracing</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">info!</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;Listening on http://127.0.0.1:7878&quot;</span><span style="color:#D4D4D4;">);</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#4EC9B0;">Server</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">TcpListener</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">bind</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;127.0.0.1:7878&quot;</span><span style="color:#D4D4D4;">)).</span><span style="color:#DCDCAA;">serve</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">router</span><span style="color:#D4D4D4;">).</span><span style="color:#C586C0;">await</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">#[handler]</span></span>
<span class="line"><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">user_connected</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">req</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Request</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Response</span><span style="color:#D4D4D4;">) -&gt; </span><span style="color:#4EC9B0;">Result</span><span style="color:#D4D4D4;">&lt;(), </span><span style="color:#4EC9B0;">StatusError</span><span style="color:#D4D4D4;">&gt; {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">user</span><span style="color:#D4D4D4;">: </span><span style="color:#4EC9B0;">Result</span><span style="color:#D4D4D4;">&lt;</span><span style="color:#4EC9B0;">User</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">ParseError</span><span style="color:#D4D4D4;">&gt; = </span><span style="color:#9CDCFE;">req</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">parse_queries</span><span style="color:#D4D4D4;">();</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#C586C0;">match</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">user</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#4EC9B0;">Ok</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">user</span><span style="color:#D4D4D4;">) =&gt; {</span></span>
<span class="line"><span style="color:#D4D4D4;">            </span><span style="color:#4EC9B0;">WebSocketUpgrade</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">().</span><span style="color:#DCDCAA;">upgrade</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">req</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">, |</span><span style="color:#9CDCFE;">ws</span><span style="color:#D4D4D4;">| </span><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">move</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">                </span><span style="color:#DCDCAA;">handle_socket</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">ws</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">user</span><span style="color:#D4D4D4;">).</span><span style="color:#C586C0;">await</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"><span style="color:#D4D4D4;">            }).</span><span style="color:#C586C0;">await</span></span>
<span class="line"><span style="color:#D4D4D4;">        }</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#4EC9B0;">Err</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">_err</span><span style="color:#D4D4D4;">) =&gt; {</span></span>
<span class="line"><span style="color:#D4D4D4;">            </span><span style="color:#4EC9B0;">Err</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">StatusError</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">bad_request</span><span style="color:#D4D4D4;">())</span></span>
<span class="line"><span style="color:#D4D4D4;">        }</span></span>
<span class="line"><span style="color:#D4D4D4;">    }</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,10),y={href:"https://github.com/salvo-rs/salvo/tree/main/examples/ws-chat-with-salvo-websocket",target:"_blank",rel:"noopener noreferrer"};function i(C,d){const a=p("ExternalLinkIcon");return o(),e("div",null,[t,s("p",null,[n("更多內容，請直接查閱"),s("a",y,[n("示例"),D(a)])])])}const u=l(c,[["render",i],["__file","third-party.html.vue"]]);export{u as default};
