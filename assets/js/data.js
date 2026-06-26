/* ============================================================================
 *  data.js — 肌悩み別 成分診断のデータ層
 *  ここを書き換えるだけで「成分・効能・注意点・研究データ・おすすめ商品・
 *  アフィリリンク・商品画像」をすべて更新できます。
 * ==========================================================================*/

/* --- ① アフィリエイト設定 ------------------------------------------------
 *  AFFILIATE_TAG をあなたの Amazonアソシエイト ID（例 "yourid-22"）に変更。
 *  各商品に正確な ASIN を入れると商品ページ直リンク／画像取得がしやすくなります。
 *  asin が空(null)なら、商品名での Amazon 検索リンク（リンク切れしない）になります。
 * ------------------------------------------------------------------------*/
const AFFILIATE_TAG = "PLACEHOLDER-22"; // ← ここをあなたのIDに

function buildAmazonLink(p) {
  if (p.url) return p.url;                  // 本人のアフィリ短縮リンク（amzn.to等）をそのまま使用
  if (p.asin) return `https://www.amazon.co.jp/dp/${p.asin}/?tag=${AFFILIATE_TAG}`;
  return `https://www.amazon.co.jp/s?k=${encodeURIComponent(p.q || p.name)}&tag=${AFFILIATE_TAG}`;
}

/* --- ② 商品マスタ --------------------------------------------------------
 *  img: 商品画像。null の場合はカテゴリ別のライン画像を自動表示します。
 *       実写真を載せる場合は assets/img/products/ に置き "products/xxx.webp" と指定。
 *       （大きい画像は webp に変換してから入れてください）
 *  cat: 化粧水 / ジェル / 乳液 / オイル / ミスト / 美容液 / 日焼け止め
 *  otc: true で「医薬部外品」バッジ。price: 参考価格（null可）
 * ------------------------------------------------------------------------*/
/* 成分ごとに1枠（特定銘柄は置かず「成分で選ぶ」検索リンク）。
 * キーは INGREDIENTS と対応。実商品にしたい場合は asin と name を入れる。*/
const PRODUCTS = {
  niacinamide: { name:"ナイアシンアミド美容液", brand:"おすすめ", cat:"美容液", price:null, otc:false, asin:null, img:null, url:"https://amzn.to/4vzmqLe", q:"ナイアシンアミド 美容液", note:"皮脂・毛穴・くすみに。" },
  hyaluronic:  { name:"ヒアルロン酸 化粧水", brand:"おすすめ", cat:"化粧水", price:null, otc:false, asin:null, img:null, url:"https://amzn.to/3SuxTgo", q:"ヒアルロン酸 化粧水", note:"水分を抱える保湿の定番。" },
  ceramide:    { name:"セラミド 化粧水・クリーム", brand:"おすすめ", cat:"化粧水", price:null, otc:false, asin:null, img:null, url:"https://amzn.to/4vJ2R2Q", q:"セラミド 化粧水", note:"バリアを立て直す。" },
  cica:        { name:"CICA（ツボクサ）化粧水", brand:"成分で選ぶ", cat:"化粧水", price:null, otc:false, asin:null, img:null, q:"CICA ツボクサ 化粧水", note:"ゆらいだ肌の鎮静に。" },
  glycyrrhizin:{ name:"グリチルリチン酸2K 薬用化粧水", brand:"おすすめ", cat:"化粧水", price:null, otc:true, asin:null, img:null, url:"https://amzn.to/4w6rO8f", q:"グリチルリチン酸2K 薬用 化粧水", note:"肌荒れ・ニキビ予防に。" },
  squalane:    { name:"スクワランオイル", brand:"成分で選ぶ", cat:"オイル", price:null, otc:false, asin:null, img:null, q:"スクワラン オイル", note:"軽い油分でフタ。" },
  betaine:     { name:"ベタイン 配合化粧水", brand:"成分で選ぶ", cat:"化粧水", price:null, otc:false, asin:null, img:null, q:"ベタイン 化粧水", note:"軽い保湿に。" },
  jojoba_oil:  { name:"ホホバオイル", brand:"成分で選ぶ", cat:"オイル", price:null, otc:false, asin:null, img:null, q:"ホホバオイル 無添加", note:"皮脂バランスに。夜に少量。" },
  allantoin:   { name:"アラントイン 配合化粧水", brand:"成分で選ぶ", cat:"化粧水", price:null, otc:false, asin:null, img:null, q:"アラントイン 化粧水", note:"修復・鎮静に。" },
  betaglucan:  { name:"β-グルカン 美容液", brand:"成分で選ぶ", cat:"美容液", price:null, otc:false, asin:null, img:null, q:"βグルカン 美容液", note:"赤み・ヒリつきに。" },
  trehalose:   { name:"トレハロース 配合化粧水", brand:"成分で選ぶ", cat:"化粧水", price:null, otc:false, asin:null, img:null, q:"トレハロース 化粧水", note:"うるおいキープ。" },
  aminoacid:   { name:"アミノ酸 配合化粧水", brand:"成分で選ぶ", cat:"化粧水", price:null, otc:false, asin:null, img:null, q:"アミノ酸 化粧水", note:"保水力アップ。" },
  vitc:        { name:"ビタミンC（誘導体）美容液", brand:"おすすめ", cat:"美容液", price:null, otc:false, asin:null, img:null, url:"https://amzn.to/4eMjVOv", q:"ビタミンC 誘導体 美容液", note:"くすみ・毛穴・皮脂に。" },
  retinol:     { name:"レチノール美容液", brand:"おすすめ", cat:"美容液", price:null, otc:false, asin:null, img:null, url:"https://amzn.to/4eIWdCJ", q:"レチノール 美容液", note:"夜・少量から。" },
  salicylic:   { name:"サリチル酸（BHA）化粧水", brand:"おすすめ", cat:"化粧水", price:null, otc:false, asin:null, img:null, url:"https://amzn.to/4vxudJd", q:"サリチル酸 BHA 化粧水", note:"毛穴・角栓に。" },
  azelaic:     { name:"アゼライン酸 ジェル", brand:"おすすめ", cat:"美容液", price:null, otc:false, asin:null, img:null, url:"https://amzn.to/3R4CZiX", q:"アゼライン酸 ジェル", note:"ニキビ・赤みに。" },
  uv:          { name:"日焼け止め（SPF50 / PA++++）", brand:"成分で選ぶ", cat:"日焼け止め", price:null, otc:false, asin:null, img:null, q:"日焼け止め SPF50 PA++++", note:"全悩み共通の土台。" },
};

/* --- ③ 成分マスタ --------------------------------------------------------
 *  why     : 効能（やさしい言葉で）
 *  caution : 注意点
 *  evidence: ※タップで出てくる研究データ（出典つき・ファクトチェック済み）
 * ------------------------------------------------------------------------*/
const INGREDIENTS = {
  niacinamide: { name:"ナイアシンアミド", en:"Niacinamide", tag:"皮脂・美白・バリア",
    why:"テカリ・毛穴・くすみ・シミ・小じわに。",
    caution:"高濃度（10%前後〜）は人により赤みが出ることも。まずは2〜5%から。",
    evidence:"5%外用で小じわ・色素斑・赤みが有意に改善（Bissett 2005, PMID 16029679）。チロシナーゼは阻害せず、メラノソームのケラチノサイトへの受け渡しを抑制して色ムラを軽減（Hakozaki 2002, PMID 12100180）。2%外用でTEWL低下＝バリア改善の報告も。" },
  hyaluronic: { name:"ヒアルロン酸Na", en:"Hyaluronic acid", tag:"保湿",
    why:"乾燥・うるおい不足に。",
    caution:"「真皮深部まで浸透」は誇大表現。基本は角質層レベルの保湿です。",
    evidence:"ラマン分光の実測で、低分子(20〜300kDa)は角質層を一部通過、高分子(1000kDa超)は表面に留まり保水膜を形成（Essendoubi et al., 2016 ほか）。" },
  ceramide: { name:"セラミド", en:"Ceramide", tag:"バリア",
    why:"乾燥・バリア低下・敏感に。",
    caution:"低刺激で使いやすい。表示は「セラミドNP」など末尾の記号で種類が分かる。",
    evidence:"角質細胞間脂質の主成分。乾燥肌・アトピーで減少しTEWLが上昇、外用でTEWL低下・水分増加が複数試験・メタ解析で確認。" },
  cica: { name:"CICA（ツボクサエキス）", en:"Centella", tag:"鎮静",
    why:"赤み・ゆらぎ・肌荒れに。",
    caution:"まれにアレルギーの報告あり。合わなければ中止を。",
    evidence:"アシアチコシド／マデカッソシドがコラーゲン産生促進・NF-κB抑制に関与。機序の裏付けはあるがヒト大規模RCTは限定的（化粧品の整肌成分）。" },
  glycyrrhizin: { name:"グリチルリチン酸2K", en:"Dipotassium glycyrrhizate", tag:"抗炎症",
    why:"肌荒れ・ニキビの炎症に。",
    caution:"低刺激。多くの薬用化粧水に配合される定番。",
    evidence:"甘草由来。日本で医薬部外品の抗炎症（肌荒れ防止）有効成分として承認されている、確立した成分。" },
  squalane: { name:"スクワラン", en:"Squalane", tag:"保湿（油分）",
    why:"乾燥・水分の蒸発防止に。",
    caution:"油分が苦手な人・ニキビが活発な時は量を控えめに。",
    evidence:"皮脂中スクワレンの水素添加物。エモリエント／オクルーシブとして機能し、二重結合を除いた構造ゆえ酸化に安定（抗酸化作用は元のスクワレン側）。" },
  betaine: { name:"ベタイン", en:"Betaine", tag:"保湿",
    why:"軽い保湿・テカリ対策に。",
    caution:"低刺激でほぼ全肌タイプ向け。",
    evidence:"天然由来のヒューメクタント。角質の水分保持・使用感改善に用いられる。" },
  jojoba_oil: { name:"ホホバオイル", en:"Jojoba", tag:"皮脂バランス",
    why:"皮脂バランス・テカリに。",
    caution:"オイルなのでニキビが活発な時は量に注意。夜に少量から。",
    evidence:"約97%が液体ワックスエステルで、皮脂中のワックスエステル成分に構造が類似。天然トコフェロール等により酸化安定性が高い。皮脂抑制の臨床はメーカー由来の小規模試験のみで限定的。" },
  allantoin: { name:"アラントイン", en:"Allantoin", tag:"修復",
    why:"刺激後の肌荒れ・修復に。",
    caution:"低刺激。鎮静・修復が主役で、角質をはがす力は弱め。",
    evidence:"創傷治癒・鎮静のエビデンスあり。角質溶解作用は弱く、主用途は修復・鎮静。" },
  betaglucan: { name:"β-グルカン", en:"Beta-glucan", tag:"鎮静",
    why:"赤み・ヒリつきの鎮静に。",
    caution:"低刺激。敏感肌の選択肢に。",
    evidence:"抗炎症・抗酸化・保湿のサポートが報告される。皮膚での直接的な大規模臨床はやや限定的。" },
  trehalose: { name:"トレハロース", en:"Trehalose", tag:"保湿",
    why:"乾燥・うるおいキープに。",
    caution:"低刺激。",
    evidence:"乾燥ストレス下でガラス状態を作り細胞を保護するヒューメクタント。外用でTEWL低下の報告。" },
  aminoacid: { name:"アミノ酸（NMF）", en:"Amino acids", tag:"保湿",
    why:"乾燥・保水力アップに。",
    caution:"低刺激。",
    evidence:"天然保湿因子(NMF)は遊離アミノ酸＋PCA・ウロカニン酸等が50%超を占め、フィラグリン分解に由来する確立した知見。" },
  vitc: { name:"ビタミンC（誘導体）", en:"Vitamin C", tag:"美白・抗酸化",
    why:"くすみ・シミ・毛穴・皮脂に。",
    caution:"高濃度・低pHは刺激が出ることも。朝に使うなら必ず日焼け止めを。",
    evidence:"チロシナーゼ抑制＋生成したメラニンの還元で美白に寄与し、抗酸化作用を持つ。誘導体は安定性・刺激面で扱いやすい。" },
  retinol: { name:"レチノール", en:"Retinol", tag:"エイジング",
    why:"シワ・ハリ・毛穴・キメに。",
    caution:"初期に赤み・皮むけ（A反応）が出ることも。週2〜3回・夜・少量から。日中はUV必須。妊娠・授乳中は医師に相談を。",
    evidence:"小じわ・ハリ改善のエビデンスがあるレチノイド。刺激が出やすく低濃度からの慣らしが推奨。光で不安定なため夜使用が基本。" },
  salicylic: { name:"サリチル酸（BHA）", en:"Salicylic acid", tag:"角質・毛穴",
    why:"毛穴詰まり・角栓・ザラつきに。",
    caution:"乾燥・刺激が出やすい。敏感肌は頻度を控えめに。",
    evidence:"脂溶性のβヒドロキシ酸で、毛穴の皮脂・角栓に作用。角質ケア成分として用いられる。" },
  azelaic: { name:"アゼライン酸", en:"Azelaic acid", tag:"ニキビ・赤み",
    why:"ニキビ・赤み・くすみに。",
    caution:"初期にピリつきが出ることがある。",
    evidence:"抗菌・抗炎症・チロシナーゼ抑制（色素沈着ケア）の複数作用が知られ、刺激が比較的少なく長期使用に向く。" },
  uv: { name:"UVケア（日焼け止め）", en:"UV protection", tag:"予防",
    why:"シミ・シワ・たるみの予防に。",
    caution:"塗る量が少ないと効果は半減。2〜3時間ごとに塗り直しを。",
    evidence:"肌老化の大部分は紫外線による光老化。UVAは真皮まで届きコラーゲン・エラスチンを損なう。SPFはUVB、PAはUVAの指標。" },
};

/* 複数選択時の共通スキンケア順（個別ルーティンを統合）*/
const GENERIC_ROUTINE = ["化粧水でうるおす", "気になる悩みは美容液でケア", "乳液かジェルでフタ"];

/* --- ④ 肌悩みマスタ（診断の主役）----------------------------------------
 *  recommend: 表示順。{ ing:成分ID, product:商品ID } を上から繰り返し表示。
 * ------------------------------------------------------------------------*/
const CONCERNS = [
  { id:"oily", icon:"drop", label:"テカリ・ベタつき", sub:"皮脂が気になる",
    headline:"皮脂は“敵”じゃない。整える。",
    summary:"取りすぎると逆効果。水分を与えて、皮脂バランスを整えるのが近道。",
    recommend:[ {ing:"niacinamide",product:"ipsa_aqua"}, {ing:"glycyrrhizin",product:"orbis_clearful"}, {ing:"hyaluronic",product:"naturie_gel"} ],
    routine:["化粧水（さっぱり）","軽いジェルで保湿"] },

  { id:"dry", icon:"leaf", label:"乾燥・つっぱり", sub:"うるおい不足",
    headline:"水を“入れる”より、“逃がさない”。",
    summary:"大切なのは、与えるより守ること。セラミドで壁を直し、油分でフタを。",
    recommend:[ {ing:"ceramide",product:"curel_lotion3"}, {ing:"hyaluronic",product:"hadalabo_gokujun"}, {ing:"aminoacid",product:"minon_lotion2"} ],
    routine:["化粧水でうるおす","乳液で水分を抱える"] },

  { id:"sensitive", icon:"shield", label:"赤み・ヒリつき", sub:"刺激に弱い",
    headline:"足すより、引く。鎮めて、守る。",
    summary:"修復と鎮静が最優先。成分は盛らず、低刺激でシンプルに。",
    recommend:[ {ing:"glycyrrhizin",product:"minon_lotion2"}, {ing:"allantoin",product:"laroche_toleriane"}, {ing:"ceramide",product:"curel_lotion3"}, {ing:"betaglucan",product:"avene_water"} ],
    routine:["低刺激の化粧水","乳液かジェルでシンプルに","刺激の強い成分は控える"] },

  { id:"pores", icon:"circle", label:"毛穴の開き・黒ずみ", sub:"ザラつき・凹凸",
    headline:"毛穴は、原因で打ち手が変わる。",
    summary:"原因でケアが変わる。皮脂・角栓には整える＋やわらげる、たるみにはハリ成分を。",
    recommend:[ {ing:"niacinamide",product:"muji_clearcare"}, {ing:"vitc",product:"vitc"}, {ing:"salicylic",product:"bha"}, {ing:"retinol",product:"retinol"} ],
    routine:["化粧水（ナイアシンアミド系）","ビタミンC美容液","保湿で仕上げ"] },

  { id:"acne", icon:"spark", label:"ニキビ・吹き出物", sub:"繰り返す",
    headline:"炎症は鎮める、詰まりは防ぐ。",
    summary:"軽いニキビは抗炎症と角質ケアで予防。皮脂を取りすぎず保湿も。",
    recommend:[ {ing:"glycyrrhizin",product:"orbis_clearful"}, {ing:"azelaic",product:"azelaic"}, {ing:"niacinamide",product:"muji_clearcare"}, {ing:"salicylic",product:"bha"} ],
    routine:["薬用化粧水で予防","軽く保湿（省かない）","気になる時は皮膚科へ"],
    clinic:true },

  { id:"spots", icon:"sun", label:"シミ・くすみ", sub:"明るさが欲しい",
    headline:"“防ぐ”が、いちばん効く美白。",
    summary:"できたシミより、増やさないことが先。ビタミンC・ナイアシンアミドで明るさをキープ。",
    recommend:[ {ing:"vitc",product:"vitc"}, {ing:"niacinamide",product:"ipsa_aqua"} ],
    routine:["化粧水","ビタミンC美容液","保湿"] },

  { id:"aging", icon:"wave", label:"シワ・ハリ不足", sub:"年齢サイン",
    headline:"ハリは、夜つくる。日中は守る。",
    summary:"夜に育て、昼に守る。レチノール・ビタミンCに、UVケアをセットで。",
    recommend:[ {ing:"retinol",product:"retinol"}, {ing:"vitc",product:"vitc"}, {ing:"niacinamide",product:"ipsa_aqua"}, {ing:"ceramide",product:"curel_lotion3"} ],
    routine:["化粧水","夜はレチノール（少量から）","保湿でフタ"] },

  { id:"combo", icon:"split", label:"混合肌・部分テカリ", sub:"場所で違う",
    headline:"顔は一枚じゃない。部位で替える。",
    summary:"全顔同じより、部位で強弱を。乾く所は守り、テカる所は軽く。",
    recommend:[ {ing:"niacinamide",product:"ipsa_aqua"}, {ing:"hyaluronic",product:"naturie_gel"}, {ing:"ceramide",product:"muji_milk"}, {ing:"betaine",product:"muji_clearcare"} ],
    routine:["化粧水を全体に","頬など乾く所は乳液","Tゾーンは軽いジェル"] },
];

/* --- ⑤ 読み物（ハンバーガーメニューから開く）---------------------------- */
const READING = [
  {
    id: "ingredients",
    title: "意味のない成分の話",
    lead: "高そうに見えて、肌の奥には届かない成分があります。",
    body:
      "<p>加水分解していないコラーゲン、高分子ヒアルロン酸、プラセンタ、核酸（サーモンDNA等）、大きなペプチド——これらは分子が大きく、角質層の“壁”を越えられません。<strong>分子量がおよそ500を超えると入りにくい</strong>（＝500ダルトンの目安／Bos &amp; Meinardi, 2000）。だから「肌の奥まで届く」という宣伝には、根拠が乏しいことが多いのです。</p>" +
      "<p>「幹細胞」もよく誤解されます。化粧品に入るのは生きた細胞ではなく<strong>培養液エキス（培養上清）</strong>。塗って細胞が再生するわけではなく、作用は抗酸化やシグナルのサポートが中心です。成長因子（EGF等）も分子が大きく、基本は浅い層まで。</p>" +
      "<p>価格や派手な売り文句よりも、<strong>角質層レベルで確かに働く成分</strong>（セラミド・ナイアシンアミド・ヒアルロン酸Na・グリセリンなど）を選ぶのが堅実です。</p>",
  },
  {
    id: "barrier",
    title: "肌のバリア（壁）の話",
    lead: "角質層は、レンガとモルタルでできた“壁”です。",
    body:
      "<p>肌の表面にある角質層は、<strong>レンガ（角質細胞）とモルタル（細胞間脂質）</strong>でできた壁のような構造。この壁が健康なら、外からの刺激を防ぎ、内側の水分を逃がしません。</p>" +
      "<p>ところが、過剰な洗顔・アルコール・強い摩擦などで脂質が壊れると、水分が逃げて（<strong>TEWL＝経表皮水分蒸散の上昇</strong>）、乾燥や赤み・炎症が起きやすくなります。</p>" +
      "<p>この壁の“モルタル”を補うのが<strong>セラミド</strong>。乾燥や敏感が気になるときは、新しい成分を足すより、まず壁を立て直すことが近道です。</p>",
  },
  {
    id: "lotion",
    title: "化粧水は意味ある？",
    lead: "「意味ない」は言い過ぎ。でも主役でもない。",
    body:
      "<p>保湿成分入りの化粧水は、実際に角質の水分を上げます。ただし<strong>単体では持続が短い</strong>ので、後から乳液やクリームで“フタ”をするのが前提。</p>" +
      "<p>化粧水は主役ではなく、肌を整える<strong>導入役</strong>。高い一本に頼るより、悩みに合う成分を、正しい順番で重ねることが大切です。</p>",
  },
];
