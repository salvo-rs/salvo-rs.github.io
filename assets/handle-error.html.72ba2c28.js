import{_ as l,r as p,o,c as e,b as n,d as s,a as r,w as D,e as c}from"./app.3f2e9511.js";const t={},i=c(`<h1 id="错误处理" tabindex="-1"><a class="header-anchor" href="#错误处理" aria-hidden="true">#</a> 错误处理</h1><h2 id="rust-应用中的常规错误处理方式" tabindex="-1"><a class="header-anchor" href="#rust-应用中的常规错误处理方式" aria-hidden="true">#</a> Rust 应用中的常规错误处理方式</h2><p>Rust 的错误处理不同于 Java 等语言, 它没有 <code>try...catch</code> 这种玩意, 正常的做法是在应用程序层面定义全局的错误处理类型:</p><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#569CD6;">use</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">thiserror</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">Error</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">#[derive(</span><span style="color:#4EC9B0;">Error</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">Debug</span><span style="color:#D4D4D4;">)]</span></span>
<span class="line"><span style="color:#569CD6;">pub</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">enum</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">AppError</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">    #[error(</span><span style="color:#CE9178;">&quot;io: \`{0}\`&quot;</span><span style="color:#D4D4D4;">)]</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#DCDCAA;">Io</span><span style="color:#D4D4D4;">(#[</span><span style="color:#9CDCFE;">from</span><span style="color:#D4D4D4;">] </span><span style="color:#4EC9B0;">io</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">Error</span><span style="color:#D4D4D4;">),</span></span>
<span class="line"><span style="color:#D4D4D4;">    #[error(</span><span style="color:#CE9178;">&quot;utf8: \`{0}\`&quot;</span><span style="color:#D4D4D4;">)]</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#DCDCAA;">FromUtf8</span><span style="color:#D4D4D4;">(#[</span><span style="color:#9CDCFE;">from</span><span style="color:#D4D4D4;">] </span><span style="color:#4EC9B0;">FromUtf8Error</span><span style="color:#D4D4D4;">),</span></span>
<span class="line"><span style="color:#D4D4D4;">    #[error(</span><span style="color:#CE9178;">&quot;diesel: \`{0}\`&quot;</span><span style="color:#D4D4D4;">)]</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#DCDCAA;">Diesel</span><span style="color:#D4D4D4;">(#[</span><span style="color:#9CDCFE;">from</span><span style="color:#D4D4D4;">] </span><span style="color:#4EC9B0;">diesel</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">result</span><span style="color:#D4D4D4;">::</span><span style="color:#4EC9B0;">Error</span><span style="color:#D4D4D4;">),</span></span>
<span class="line"><span style="color:#D4D4D4;">    ...</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#569CD6;">pub</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">type</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">AppResult</span><span style="color:#D4D4D4;">&lt;</span><span style="color:#4EC9B0;">T</span><span style="color:#D4D4D4;">&gt; = </span><span style="color:#4EC9B0;">Result</span><span style="color:#D4D4D4;">&lt;</span><span style="color:#4EC9B0;">T</span><span style="color:#D4D4D4;">, </span><span style="color:#4EC9B0;">AppError</span><span style="color:#D4D4D4;">&gt;;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里使用了 <code>thiserror</code> 这个库, 它可以方便地定义你自己的自定义错误类型, 简化代码. 为了简单书写, 顺便定义一个 <code>AppResult</code>.</p><h2 id="handler-中的错误处理" tabindex="-1"><a class="header-anchor" href="#handler-中的错误处理" aria-hidden="true">#</a> Handler 中的错误处理</h2><p>在 Salvo 中, <code>Handler</code> 也经常会遇到各式错误, 比如: 数据库连接错误, 文件访问错误, 网络连接错误等等. 对于这个类型的错误, 可以采用上述的错误处理手法:</p><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#D4D4D4;">#[handler]</span></span>
<span class="line"><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">home</span><span style="color:#D4D4D4;">()-&gt; </span><span style="color:#4EC9B0;">AppResult</span><span style="color:#D4D4D4;">&lt;()&gt; {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里的 <code>home</code> 就直接返回了一个 <code>AppResult&lt;()&gt;</code>. 但是, 这个错误改如何显示呢? 我们需要为 <code>AppResult</code> 这个自定义错误类型实现 <code>Writer</code>, 在这个实现中我们可以决定如何显示错误:</p><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#D4D4D4;">#[async_trait]</span></span>
<span class="line"><span style="color:#569CD6;">impl</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Writer</span><span style="color:#D4D4D4;"> </span><span style="color:#C586C0;">for</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">AppError</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">write</span><span style="color:#D4D4D4;">(</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">self</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">_req</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Request</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">depot</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Depot</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Response</span><span style="color:#D4D4D4;">) {</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">render</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">Text</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">Plain</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;I&#39;m a error, hahaha!&quot;</span><span style="color:#D4D4D4;">));</span></span>
<span class="line"><span style="color:#D4D4D4;">    }</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>Errror</code> 中往往包含一些敏感信息, 一般情况下, 并不想被普通用户看到, 那样也太不安全了, 一点点隐私也没有了. 但是, 如果你是开发人员或者网站管理员, 或许想法就不一样了, 你希望错误能把外衣脱得光光的, 让你看到最真实的错误信息.</p><p>可以看到, <code>write</code> 的方法中, 我们其实是可以拿到 <code>Request</code> 和 <code>Depot</code> 的引用的, 这就可以很方便地实现上面的骚操作了:</p><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#D4D4D4;">#[async_trait]</span></span>
<span class="line"><span style="color:#569CD6;">impl</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Writer</span><span style="color:#D4D4D4;"> </span><span style="color:#C586C0;">for</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">AppError</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#569CD6;">async</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">fn</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">write</span><span style="color:#D4D4D4;">(</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">self</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">_req</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Request</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">depot</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Depot</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">: &amp;</span><span style="color:#569CD6;">mut</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">Response</span><span style="color:#D4D4D4;">) {</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#569CD6;">let</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">user</span><span style="color:#D4D4D4;"> = </span><span style="color:#9CDCFE;">depot</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">obtain</span><span style="color:#D4D4D4;">::&lt;</span><span style="color:#4EC9B0;">User</span><span style="color:#D4D4D4;">&gt;();</span></span>
<span class="line"><span style="color:#D4D4D4;">        </span><span style="color:#C586C0;">if</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">user</span><span style="color:#D4D4D4;">.is_admin {</span></span>
<span class="line"><span style="color:#D4D4D4;">            </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">render</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">Text</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">Plain</span><span style="color:#D4D4D4;">(</span><span style="color:#9CDCFE;">e</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">to_string</span><span style="color:#D4D4D4;">()));</span></span>
<span class="line"><span style="color:#D4D4D4;">        } </span><span style="color:#C586C0;">else</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">            </span><span style="color:#9CDCFE;">res</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">render</span><span style="color:#D4D4D4;">(</span><span style="color:#4EC9B0;">Text</span><span style="color:#D4D4D4;">::</span><span style="color:#DCDCAA;">Plain</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;I&#39;m a error, hahaha!&quot;</span><span style="color:#D4D4D4;">));</span></span>
<span class="line"><span style="color:#D4D4D4;">        }</span></span>
<span class="line"><span style="color:#D4D4D4;">    }</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="错误页面的显示" tabindex="-1"><a class="header-anchor" href="#错误页面的显示" aria-hidden="true">#</a> 错误页面的显示</h2><p>Salvo 中自带的错误页面在绝大部分情况下是满足需求的, 它可以根据请求的数据类型, 显示 Html, Json 或者 Xml 页面. 然而, 某些情况下, 我们依然期望自定义错误页面的显示.</p>`,15),y=n("code",null,"Catcher",-1),d=n("code",null,"Catcher",-1);function C(u,v){const a=p("RouterLink");return o(),e("div",null,[i,n("p",null,[s("这个可以通过自定义 "),y,s(" 实现. 详细的介绍可以查看 "),r(a,{to:"/zh-hans/book/core/catcher/"},{default:D(()=>[d]),_:1}),s(" 部分的讲解.")])])}const E=l(t,[["render",C],["__file","handle-error.html.vue"]]);export{E as default};
