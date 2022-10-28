import{_ as s,o as n,c as a,e as l}from"./app.3f2e9511.js";const p={},o=l(`<h1 id="handler" tabindex="-1"><a class="header-anchor" href="#handler" aria-hidden="true">#</a> Handler</h1><h2 id="什麽是-handler" tabindex="-1"><a class="header-anchor" href="#什麽是-handler" aria-hidden="true">#</a> 什麽是 Handler</h2><p>Handler 是負責負責處理 Request 請求的具體對象. Hander 本身是一個 Trait, 內部包含一個 <code>handle</code> 的異步方法:</p><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#D4D4D4;">#[async_trait]</span></span>
<span class="line"><span style="color:#569CD6;">pub</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">trait</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Handler</span><span style="color:#D4D4D4;">: </span><span style="color:#4EC9B0;">Send</span><span style="color:#D4D4D4;"> + </span><span style="color:#4EC9B0;">Sync</span><span style="color:#D4D4D4;"> + &#39;</span><span style="color:#4EC9B0;">static</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">handle</span><span style="color:#D4D4D4;">(&amp;</span><span style="color:#569CD6;">self</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">req</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Request</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">depot</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Depot</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Response</span><span style="color:#D4D4D4;">);</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="函數式-handler" tabindex="-1"><a class="header-anchor" href="#函數式-handler" aria-hidden="true">#</a> 函數式 Handler</h2><p>很多時候只是希望通過函數作為 <code>Handler</code> 處理請求. 可以添加 <code>Handler</code> 將普通函數轉為 <code>Handler</code>.</p><p>處理函數默認簽名包含四個參數, 依次是, <code>&amp;mut Request, &amp;mut Depot. &amp;mut Response, &amp;mut FlowCtrl</code>. Depot 是一個臨時存儲, 可以存儲本次請求相關的數據.</p><p>中間件其實也是 <code>Handler</code>, 它們可以對請求到達正式處理請求的 <code>Handler</code> 之前或者之後作一些處理 比如：登錄驗證, 數據壓縮等.</p><p>中間件是通過 <code>Router</code> 的 <code>hoop</code> 函數添加的. 被添加的中間件會影響當前的 <code>Router</code> 和它內部所有子孫 <code>Router</code>.</p><p>正常項目中使用得最多的應該是 <code>Handler</code>, 它是一個 <code>proc macro</code>, 加在函數上可以將函數轉變成一個 <code>Handler</code>:</p><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#D4D4D4;">#[handler]</span></span>
<span class="line"><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">hello_world</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">_req</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Request</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">_depot</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Depot</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Response</span><span style="color:#D4D4D4;">) {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">render</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;Hello world&quot;</span><span style="color:#D4D4D4;">);</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>某些參數如果不需要, 可以直接省略. 事實上, 這三個參數的順序可以按喜好自由調整, 也可以省略任何一個或者多個參數. 下面這些寫法都是可以的:</p><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#D4D4D4;">#[handler]</span></span>
<span class="line"><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">hello_world</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">req</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Request</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Response</span><span style="color:#D4D4D4;">) {</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"><span style="color:#D4D4D4;">#[handler]</span></span>
<span class="line"><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">hello_world</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">depot</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Depot</span><span style="color:#D4D4D4;">) {</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"><span style="color:#D4D4D4;">#[handler]</span></span>
<span class="line"><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">hello_world</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Response</span><span style="color:#D4D4D4;">) {</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="處理錯誤" tabindex="-1"><a class="header-anchor" href="#處理錯誤" aria-hidden="true">#</a> 處理錯誤</h2><p>Salvo 中的 <code>Handler</code> 可以返回 <code>Result</code>, 只需要 <code>Result</code> 中的 <code>Ok</code> 和 <code>Err</code> 的類型都實現 <code>Writer</code> trait. 考慮到 anyow 的使用比較廣泛, 在開啟 <code>anyhow</code> 功能後, <code>anyhow::Error</code> 會實現 <code>Writer</code> trait. <code>anyhow::Error</code> 會被映射為 <code>InternalServerError</code>.</p><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#D4D4D4;">#[cfg(feature = </span><span style="color:#CE9178;">&quot;anyhow&quot;</span><span style="color:#D4D4D4;">)]</span></span>
<span class="line"><span style="color:#D4D4D4;">#[async_trait]</span></span>
<span class="line"><span style="color:#569CD6;">impl</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Writer</span><span style="color:#D4D4D4;"> </span><span style="color:#C586C0;">for</span><span style="color:#D4D4D4;"> ::</span><span style="color:#4EC9B0;">anyhow</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">Error</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">write</span><span style="color:#D4D4D4;">(</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">self</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">_req</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Request</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">_depot</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Depot</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Response</span><span style="color:#D4D4D4;">) {</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">set_http_error</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">StatusError</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">internal_server_error</span><span style="color:#D4D4D4;">());</span></span>
<span class="line"><span style="color:#D4D4D4;">    }</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>對於自定義錯誤類型, 你可以根據需要輸出不同的錯誤頁面.</p><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">salvo</span><span style="color:#D4D4D4;">::anyhow;</span></span>
<span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">salvo</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">prelude</span><span style="color:#D4D4D4;">::*;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#569CD6;">struct</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">CustomError</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"><span style="color:#D4D4D4;">#[async_trait]</span></span>
<span class="line"><span style="color:#569CD6;">impl</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Writer</span><span style="color:#D4D4D4;"> </span><span style="color:#C586C0;">for</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">CustomError</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">write</span><span style="color:#D4D4D4;">(</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">self</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">_req</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Request</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">_depot</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Depot</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Response</span><span style="color:#D4D4D4;">) {</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">render</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;custom error&quot;</span><span style="color:#D4D4D4;">);</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">set_http_error</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">StatusError</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">internal_server_error</span><span style="color:#D4D4D4;">());</span></span>
<span class="line"><span style="color:#D4D4D4;">    }</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">#[handler]</span></span>
<span class="line"><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">handle_anyhow</span><span style="color:#D4D4D4;">() -&gt; </span><span style="color:#4EC9B0;">Result</span><span style="color:#D4D4D4;">&lt;(), </span><span style="color:#9CDCFE;">anyhow</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">Error</span><span style="color:#D4D4D4;">&gt; {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#4EC9B0;">Err</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">anyhow</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">anyhow!</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;anyhow error&quot;</span><span style="color:#D4D4D4;">))</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"><span style="color:#D4D4D4;">#[handler]</span></span>
<span class="line"><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">handle_custom</span><span style="color:#D4D4D4;">() -&gt; </span><span style="color:#4EC9B0;">Result</span><span style="color:#D4D4D4;">&lt;(), </span><span style="color:#4EC9B0;">CustomError</span><span style="color:#D4D4D4;">&gt; {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#4EC9B0;">Err</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">CustomError</span><span style="color:#D4D4D4;">)</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">#[tokio::main]</span></span>
<span class="line"><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">main</span><span style="color:#D4D4D4;">() {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">router</span><span style="color:#D4D4D4;"> = </span><span style="color:#4EC9B0;">Router</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">()</span></span>
<span class="line"><span style="color:#D4D4D4;">        .</span><span style="color:#DCDCAA;">push</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">Router</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">().</span><span style="color:#DCDCAA;">path</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;anyhow&quot;</span><span style="color:#D4D4D4;">).</span><span style="color:#DCDCAA;">get</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">handle_anyhow</span><span style="color:#D4D4D4;">))</span></span>
<span class="line"><span style="color:#D4D4D4;">        .</span><span style="color:#DCDCAA;">push</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">Router</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">().</span><span style="color:#DCDCAA;">path</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;custom&quot;</span><span style="color:#D4D4D4;">).</span><span style="color:#DCDCAA;">get</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">handle_custom</span><span style="color:#D4D4D4;">));</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#4EC9B0;">Server</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">new</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">TcpListener</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">bind</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;127.0.0.1:7878&quot;</span><span style="color:#D4D4D4;">)).</span><span style="color:#DCDCAA;">serve</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">router</span><span style="color:#D4D4D4;">).</span><span style="color:#C586C0;">await</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="直接實現-handler-trait" tabindex="-1"><a class="header-anchor" href="#直接實現-handler-trait" aria-hidden="true">#</a> 直接實現 Handler Trait</h2><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#569CD6;">pub</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">struct</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">MaxSizeHandler</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">u64</span><span style="color:#D4D4D4;">);</span></span>
<span class="line"><span style="color:#D4D4D4;">#[async_trait]</span></span>
<span class="line"><span style="color:#569CD6;">impl</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Handler</span><span style="color:#D4D4D4;"> </span><span style="color:#C586C0;">for</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">MaxSizeHandler</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">handle</span><span style="color:#D4D4D4;">(&amp;</span><span style="color:#569CD6;">self</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">req</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Request</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">depot</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Depot</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Response</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">ctrl</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">FlowCtrl</span><span style="color:#D4D4D4;">) {</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#C586C0;">if</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Some</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">upper</span><span style="color:#D4D4D4;">) = </span><span style="color:#9CDCFE;">req</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">body</span><span style="color:#D4D4D4;">().</span><span style="color:#DCDCAA;">and_then</span><span style="color:#D4D4D4;">(|</span><span style="color:#9CDCFE;">body</span><span style="color:#D4D4D4;">| </span><span style="color:#9CDCFE;">body</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">size_hint</span><span style="color:#D4D4D4;">().</span><span style="color:#DCDCAA;">upper</span><span style="color:#D4D4D4;">()) {</span></span>
<span class="line"><span style="color:#D4D4D4;">            </span><span style="color:#C586C0;">if</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">upper</span><span style="color:#D4D4D4;"> &gt; </span><span style="color:#569CD6;">self</span><span style="color:#D4D4D4;">.</span><span style="color:#B5CEA8;">0</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">                </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">set_status_error</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">StatusError</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">payload_too_large</span><span style="color:#D4D4D4;">());</span></span>
<span class="line"><span style="color:#D4D4D4;">                </span><span style="color:#9CDCFE;">ctrl</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">skip_rest</span><span style="color:#D4D4D4;">();</span></span>
<span class="line"><span style="color:#D4D4D4;">            } </span><span style="color:#C586C0;">else</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">                </span><span style="color:#9CDCFE;">ctrl</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">call_next</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">req</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">depot</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">).</span><span style="color:#C586C0;">await</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"><span style="color:#D4D4D4;">            }</span></span>
<span class="line"><span style="color:#D4D4D4;">        }</span></span>
<span class="line"><span style="color:#D4D4D4;">    }</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="handler-的使用" tabindex="-1"><a class="header-anchor" href="#handler-的使用" aria-hidden="true">#</a> <code>#[handler]</code> 的使用</h2><p><code>#[handler]</code> 可以大量簡化代碼的書寫, 並且提升代碼的靈活度. 它可以加在一個函數上, 讓它實現 <code>Handler</code>:</p><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#D4D4D4;">#[handler]</span></span>
<span class="line"><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">hello</span><span style="color:#D4D4D4;">() -&gt; &amp;&#39;</span><span style="color:#4EC9B0;">static</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">str</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#CE9178;">&quot;hello world!&quot;</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>這等價於:</p><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#569CD6;">struct</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">hello</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">#[async_trait]</span></span>
<span class="line"><span style="color:#569CD6;">impl</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Hander</span><span style="color:#D4D4D4;"> </span><span style="color:#C586C0;">for</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">hello</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">handle</span><span style="color:#D4D4D4;">(&amp;</span><span style="color:#569CD6;">self</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">_req</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Request</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">_depot</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Depot</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">_res</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Response</span><span style="color:#D4D4D4;">) {</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">render</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">Text</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">Plain</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;hello world!&quot;</span><span style="color:#D4D4D4;">));</span></span>
<span class="line"><span style="color:#D4D4D4;">    }</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到, 在使用 <code>#[handler]</code> 的情況下, 代碼變得簡單很多:</p><ul><li>不再需要手工添加 <code>#[async_trait]</code>.</li><li>函數中不需要的參數已經省略, 對於需要的參數也可以按任意順序排布.</li><li>對於實現了 <code>Writer</code> 或者 <code>Piece</code> 抽象的對象, 可以直接作為函數的返回值. 在這裏 <code>&amp;&#39;static str</code> 實現了 <code>Piece</code>, 於是可以直接作為函數返回值返回.</li></ul><p><code>#[handler]</code> 不僅可以加在函數上, 也可以加在 <code>struct</code> 的 <code>impl</code> 上:</p><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#569CD6;">struct</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Hello</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">#[handler]</span></span>
<span class="line"><span style="color:#569CD6;">impl</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Hello</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">handle</span><span style="color:#D4D4D4;">(&amp;</span><span style="color:#569CD6;">self</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">_req</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Request</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">_depot</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Depot</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">_res</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Response</span><span style="color:#D4D4D4;">) {</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">render</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">Text</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">Plain</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;hello world!&quot;</span><span style="color:#D4D4D4;">));</span></span>
<span class="line"><span style="color:#D4D4D4;">    }</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,29),e=[o];function D(r,c){return n(),a("div",null,e)}const y=s(p,[["render",D],["__file","handler.html.vue"]]);export{y as default};
