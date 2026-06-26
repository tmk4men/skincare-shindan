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
const PRODUCTS = {
  ipsa_aqua:   { name:"イプサ ザ・タイムR アクア 200ml", brand:"IPSA", cat:"化粧水", price:2770, otc:false, asin:null, img:null, q:"イプサ ザ・タイムR アクア 200ml" },
  muji_clearcare:{ name:"無印良品 薬用クリアケア化粧水 300mL", brand:"無印良品", cat:"化粧水", price:1690, otc:true, asin:null, img:null, q:"無印良品 薬用クリアケア化粧水 300mL" },
  orbis_clearful:{ name:"オルビス クリアフル ローション", brand:"ORBIS", cat:"化粧水", price:1650, otc:true, asin:null, img:null, q:"オルビス クリアフル ローション 薬用" },
  naturie_gel: { name:"ナチュリエ スキンコンディショニングジェル 180g", brand:"ナチュリエ", cat:"ジェル", price:665, otc:false, asin:null, img:null, q:"ナチュリエ スキンコンディショニングジェル 180g" },
  jojoba:      { name:"SAKURA&NATURAL ゴールデンホホバオイル 300ml", brand:"SAKURA&NATURAL", cat:"オイル", price:2830, otc:false, asin:null, img:null, q:"SAKURA NATURAL ゴールデンホホバオイル 300ml" },
  curel_lotion3:{ name:"キュレル 潤浸保湿化粧水III（とてもしっとり）150ml", brand:"キュレル", cat:"化粧水", price:1481, otc:true, asin:null, img:null, q:"キュレル 潤浸保湿化粧水III とてもしっとり 150ml" },
  hadalabo_gokujun:{ name:"肌ラボ 極潤プレミアム ヒアルロン液 170mL", brand:"肌ラボ", cat:"化粧水", price:797, otc:false, asin:null, img:null, q:"肌ラボ 極潤プレミアム ヒアルロン液 170mL" },
  minon_lotion2:{ name:"ミノン アミノモイスト モイストチャージ ローションII", brand:"MINON", cat:"化粧水", price:1900, otc:false, asin:null, img:null, q:"ミノン アミノモイスト モイストチャージ ローションII もっとしっとり" },
  laroche_toleriane:{ name:"ラ ロッシュ ポゼ トレリアン 薬用モイスチャーローション 200mL", brand:"La Roche-Posay", cat:"化粧水", price:5060, otc:true, asin:null, img:null, q:"ラロッシュポゼ トレリアン 薬用モイスチャーローション 200mL" },
  avene_water: { name:"アベンヌ ウォーター 300mL", brand:"Avène", cat:"ミスト", price:1800, otc:false, asin:null, img:null, q:"アベンヌ ウォーター 300mL" },
  muji_milk:   { name:"無印良品 敏感肌用乳液 しっとり 200mL", brand:"無印良品", cat:"乳液", price:783, otc:false, asin:null, img:null, q:"無印良品 敏感肌用乳液 しっとり 200mL" },
  /* 成分で選ぶカテゴリ（特定銘柄を断定せず検索で提案）*/
  vitc:      { name:"ビタミンC（誘導体）美容液", brand:"成分で選ぶ", cat:"美容液", price:null, otc:false, asin:null, img:null, q:"ビタミンC 誘導体 美容液" },
  retinol:   { name:"レチノール美容液", brand:"成分で選ぶ", cat:"美容液", price:null, otc:false, asin:null, img:null, q:"レチノール 美容液" },
  bha:       { name:"サリチル酸（BHA）配合 化粧水", brand:"成分で選ぶ", cat:"化粧水", price:null, otc:false, asin:null, img:null, q:"サリチル酸 BHA 化粧水" },
  azelaic:   { name:"アゼライン酸 配合ジェル", brand:"成分で選ぶ", cat:"美容液", price:null, otc:false, asin:null, img:null, q:"アゼライン酸 ジェル" },
  sunscreen: { name:"日焼け止め（SPF50 / PA++++）", brand:"成分で選ぶ", cat:"日焼け止め", price:null, otc:false, asin:null, img:null, q:"日焼け止め SPF50 PA++++" },
};

/* --- ③ 成分マスタ --------------------------------------------------------
 *  why     : 効能（やさしい言葉で）
 *  caution : 注意点
 *  evidence: ※タップで出てくる研究データ（出典つき・ファクトチェック済み）
 * ------------------------------------------------------------------------*/
const INGREDIENTS = {
  niacinamide: { name:"ナイアシンアミド", en:"Niacinamide", tag:"皮脂・美白・バリア",
    why:"皮脂を穏やかに抑え、メラニンの受け渡しを妨げてくすみ・シミ対策。バリア機能も支える働き者。",
    caution:"高濃度（10%前後〜）は人により赤みが出ることも。まずは2〜5%から。",
    evidence:"5%外用で小じわ・色素斑・赤みが有意に改善（Bissett 2005, PMID 16029679）。チロシナーゼは阻害せず、メラノソームのケラチノサイトへの受け渡しを抑制して色ムラを軽減（Hakozaki 2002, PMID 12100180）。2%外用でTEWL低下＝バリア改善の報告も。" },
  hyaluronic: { name:"ヒアルロン酸Na", en:"Hyaluronic acid", tag:"保湿",
    why:"角質層で水分を抱え込む保湿の定番。高分子は表面で保水膜、低分子は肌になじみやすい。",
    caution:"「真皮深部まで浸透」は誇大表現。基本は角質層レベルの保湿です。",
    evidence:"ラマン分光の実測で、低分子(20〜300kDa)は角質層を一部通過、高分子(1000kDa超)は表面に留まり保水膜を形成（Essendoubi et al., 2016 ほか）。" },
  ceramide: { name:"セラミド", en:"Ceramide", tag:"バリア",
    why:"角質の“モルタル”である細胞間脂質そのもの。壊れたバリアを立て直す。",
    caution:"低刺激で使いやすい。表示は「セラミドNP」など末尾の記号で種類が分かる。",
    evidence:"角質細胞間脂質の主成分。乾燥肌・アトピーで減少しTEWLが上昇、外用でTEWL低下・水分増加が複数試験・メタ解析で確認。" },
  cica: { name:"CICA（ツボクサエキス）", en:"Centella", tag:"鎮静",
    why:"抗炎症・整肌のサポート。ゆらいだ肌をなだめる人気成分。",
    caution:"まれにアレルギーの報告あり。合わなければ中止を。",
    evidence:"アシアチコシド／マデカッソシドがコラーゲン産生促進・NF-κB抑制に関与。機序の裏付けはあるがヒト大規模RCTは限定的（化粧品の整肌成分）。" },
  glycyrrhizin: { name:"グリチルリチン酸2K", en:"Dipotassium glycyrrhizate", tag:"抗炎症",
    why:"甘草由来の抗炎症成分。肌荒れ・ニキビの炎症をしずめる。",
    caution:"低刺激。多くの薬用化粧水に配合される定番。",
    evidence:"甘草由来。日本で医薬部外品の抗炎症（肌荒れ防止）有効成分として承認されている、確立した成分。" },
  squalane: { name:"スクワラン", en:"Squalane", tag:"保湿（油分）",
    why:"皮脂になじむ軽い油分。水分の蒸発を防ぐ“フタ”役で、酸化にも強い。",
    caution:"油分が苦手な人・ニキビが活発な時は量を控えめに。",
    evidence:"皮脂中スクワレンの水素添加物。エモリエント／オクルーシブとして機能し、二重結合を除いた構造ゆえ酸化に安定（抗酸化作用は元のスクワレン側）。" },
  betaine: { name:"ベタイン", en:"Betaine", tag:"保湿",
    why:"軽い使用感で水分を保持。テカリにくいヒューメクタント。",
    caution:"低刺激でほぼ全肌タイプ向け。",
    evidence:"天然由来のヒューメクタント。角質の水分保持・使用感改善に用いられる。" },
  jojoba_oil: { name:"ホホバオイル", en:"Jojoba", tag:"皮脂バランス",
    why:"皮脂中のワックスエステルに似た構造。少量でなじみ、酸化しにくい。脂性肌の味方。",
    caution:"オイルなのでニキビが活発な時は量に注意。夜に少量から。",
    evidence:"約97%が液体ワックスエステルで、皮脂中のワックスエステル成分に構造が類似。天然トコフェロール等により酸化安定性が高い。皮脂抑制の臨床はメーカー由来の小規模試験のみで限定的。" },
  allantoin: { name:"アラントイン", en:"Allantoin", tag:"修復",
    why:"刺激を受けた肌の回復を助ける整肌成分。",
    caution:"低刺激。鎮静・修復が主役で、角質をはがす力は弱め。",
    evidence:"創傷治癒・鎮静のエビデンスあり。角質溶解作用は弱く、主用途は修復・鎮静。" },
  betaglucan: { name:"β-グルカン", en:"Beta-glucan", tag:"鎮静",
    why:"赤み・ヒリつきをやわらげるサポート。保湿力も。",
    caution:"低刺激。敏感肌の選択肢に。",
    evidence:"抗炎症・抗酸化・保湿のサポートが報告される。皮膚での直接的な大規模臨床はやや限定的。" },
  trehalose: { name:"トレハロース", en:"Trehalose", tag:"保湿",
    why:"乾燥下でも水分を保つ糖。安定した保湿力。",
    caution:"低刺激。",
    evidence:"乾燥ストレス下でガラス状態を作り細胞を保護するヒューメクタント。外用でTEWL低下の報告。" },
  aminoacid: { name:"アミノ酸（NMF）", en:"Amino acids", tag:"保湿",
    why:"肌が本来持つ天然保湿因子の主成分。角質の保水力を底上げ。",
    caution:"低刺激。",
    evidence:"天然保湿因子(NMF)は遊離アミノ酸＋PCA・ウロカニン酸等が50%超を占め、フィラグリン分解に由来する確立した知見。" },
  vitc: { name:"ビタミンC（誘導体）", en:"Vitamin C", tag:"美白・抗酸化",
    why:"メラニンの生成を抑え、抗酸化で皮脂・毛穴にも。朝はUVケアとセットで真価。",
    caution:"高濃度・低pHは刺激が出ることも。朝に使うなら必ず日焼け止めを。",
    evidence:"チロシナーゼ抑制＋生成したメラニンの還元で美白に寄与し、抗酸化作用を持つ。誘導体は安定性・刺激面で扱いやすい。" },
  retinol: { name:"レチノール", en:"Retinol", tag:"エイジング",
    why:"ハリ・キメ・毛穴・小じわに。攻めの代表成分。",
    caution:"初期に赤み・皮むけ（A反応）が出ることも。週2〜3回・夜・少量から。日中はUV必須。妊娠・授乳中は医師に相談を。",
    evidence:"小じわ・ハリ改善のエビデンスがあるレチノイド。刺激が出やすく低濃度からの慣らしが推奨。光で不安定なため夜使用が基本。" },
  salicylic: { name:"サリチル酸（BHA）", en:"Salicylic acid", tag:"角質・毛穴",
    why:"詰まった角栓をゆるめ、皮脂・毛穴詰まり・ザラつきに。",
    caution:"乾燥・刺激が出やすい。敏感肌は頻度を控えめに。",
    evidence:"脂溶性のβヒドロキシ酸で、毛穴の皮脂・角栓に作用。角質ケア成分として用いられる。" },
  azelaic: { name:"アゼライン酸", en:"Azelaic acid", tag:"ニキビ・赤み",
    why:"抗菌・抗炎症・くすみケアの三役。比較的おだやかで続けやすい。",
    caution:"初期にピリつきが出ることがある。",
    evidence:"抗菌・抗炎症・チロシナーゼ抑制（色素沈着ケア）の複数作用が知られ、刺激が比較的少なく長期使用に向く。" },
  uv: { name:"UVケア（日焼け止め）", en:"UV protection", tag:"予防",
    why:"シミ・シワ・たるみの最大要因＝紫外線を防ぐ。どんな悩みにも共通の土台。",
    caution:"塗る量が少ないと効果は半減。2〜3時間ごとに塗り直しを。",
    evidence:"肌老化の大部分は紫外線による光老化。UVAは真皮まで届きコラーゲン・エラスチンを損なう。SPFはUVB、PAはUVAの指標。" },
};

/* --- ④ 肌悩みマスタ（診断の主役）----------------------------------------
 *  recommend: 表示順。{ ing:成分ID, product:商品ID } を上から繰り返し表示。
 * ------------------------------------------------------------------------*/
const CONCERNS = [
  { id:"oily", icon:"drop", label:"テカリ・ベタつき", sub:"皮脂が気になる",
    headline:"皮脂は“敵”じゃない。整える。",
    summary:"脂性肌は皮脂が出やすい肌。取りすぎるとかえって乾燥して皮脂が増えることも。水分は与えつつ、皮脂のバランスを穏やかに整えるのが近道です。",
    recommend:[ {ing:"niacinamide",product:"ipsa_aqua"}, {ing:"glycyrrhizin",product:"orbis_clearful"}, {ing:"hyaluronic",product:"naturie_gel"}, {ing:"jojoba_oil",product:"jojoba"} ],
    routine:["化粧水（さっぱり）","軽いジェルで保湿","夜はホホバを少量","朝は日焼け止め"] },

  { id:"dry", icon:"leaf", label:"乾燥・つっぱり", sub:"うるおい不足",
    headline:"水を“入れる”より、“逃がさない”。",
    summary:"乾燥肌はバリアがゆらぎ、水分が逃げやすい状態。与えることより守ること。セラミドで壁を立て直し、油分でしっかりフタをします。",
    recommend:[ {ing:"ceramide",product:"curel_lotion3"}, {ing:"hyaluronic",product:"hadalabo_gokujun"}, {ing:"aminoacid",product:"minon_lotion2"}, {ing:"squalane",product:"jojoba"} ],
    routine:["化粧水でうるおす","乳液で水分を抱える","オイルでフタ"] },

  { id:"sensitive", icon:"shield", label:"赤み・ヒリつき", sub:"刺激に弱い",
    headline:"足すより、引く。鎮めて、守る。",
    summary:"敏感肌はバリアが弱り、刺激に過敏な状態。修復と鎮静が最優先。成分は盛らず、シンプルに低刺激で整えるのが正解です。",
    recommend:[ {ing:"glycyrrhizin",product:"minon_lotion2"}, {ing:"allantoin",product:"laroche_toleriane"}, {ing:"ceramide",product:"curel_lotion3"}, {ing:"betaglucan",product:"avene_water"} ],
    routine:["低刺激の化粧水","乳液かジェルでシンプルに","刺激の強い成分は控える"] },

  { id:"pores", icon:"circle", label:"毛穴の開き・黒ずみ", sub:"ザラつき・凹凸",
    headline:"毛穴は、原因で打ち手が変わる。",
    summary:"毛穴は「開き」「詰まり」「黒ずみ」「たるみ」でケアが違います。皮脂と角栓が主役なら整える＋やわらげる、たるみ毛穴にはハリ成分を。",
    recommend:[ {ing:"niacinamide",product:"muji_clearcare"}, {ing:"vitc",product:"vitc"}, {ing:"salicylic",product:"bha"}, {ing:"retinol",product:"retinol"} ],
    routine:["化粧水（ナイアシンアミド系）","ビタミンC美容液","保湿で仕上げ","朝は日焼け止め"] },

  { id:"acne", icon:"spark", label:"ニキビ・吹き出物", sub:"繰り返す",
    headline:"炎症は鎮める、詰まりは防ぐ。",
    summary:"軽いニキビは抗炎症と角質ケアで予防。皮脂を取りすぎず保湿も忘れずに。赤く腫れる・繰り返す・痛む場合は、市販品より皮膚科が近道です。",
    recommend:[ {ing:"glycyrrhizin",product:"orbis_clearful"}, {ing:"azelaic",product:"azelaic"}, {ing:"niacinamide",product:"muji_clearcare"}, {ing:"salicylic",product:"bha"} ],
    routine:["薬用化粧水で予防","軽く保湿（省かない）","気になる時は皮膚科へ"],
    clinic:true },

  { id:"spots", icon:"sun", label:"シミ・くすみ", sub:"明るさが欲しい",
    headline:"“防ぐ”が、いちばん効く美白。",
    summary:"できたシミより、これ以上増やさないことが最優先。日中のUVケアが土台で、その上にビタミンCなどを重ねます。攻めと守りはセットです。",
    recommend:[ {ing:"uv",product:"sunscreen"}, {ing:"vitc",product:"vitc"}, {ing:"niacinamide",product:"ipsa_aqua"} ],
    routine:["化粧水","ビタミンC美容液","保湿","朝は日焼け止め（最重要）"] },

  { id:"aging", icon:"wave", label:"シワ・ハリ不足", sub:"年齢サイン",
    headline:"ハリは、夜つくる。日中は守る。",
    summary:"ハリ不足やシワにはレチノールやビタミンCが定番。ただし攻めの成分ほど日中の紫外線対策が前提。夜に育て、昼に守るリズムで。",
    recommend:[ {ing:"retinol",product:"retinol"}, {ing:"vitc",product:"vitc"}, {ing:"niacinamide",product:"ipsa_aqua"}, {ing:"ceramide",product:"curel_lotion3"} ],
    routine:["化粧水","夜はレチノール（少量から）","保湿でフタ","朝は日焼け止め（必須）"] },

  { id:"combo", icon:"split", label:"混合肌・部分テカリ", sub:"場所で違う",
    headline:"顔は一枚じゃない。部位で替える。",
    summary:"Tゾーンはテカるのに頬は乾く——よくある混合肌。全顔同じより、部位で強弱を。乾く所は守り、テカる所は軽く。",
    recommend:[ {ing:"niacinamide",product:"ipsa_aqua"}, {ing:"hyaluronic",product:"naturie_gel"}, {ing:"ceramide",product:"muji_milk"}, {ing:"betaine",product:"muji_clearcare"} ],
    routine:["化粧水を全体に","頬など乾く所は乳液","Tゾーンは軽いジェル"] },
];

/* --- ⑤ 「化粧水の科学」読み物（トップの折りたたみ）------------------------ */
const SCIENCE = [
  { q:"化粧水って、結局“意味ない”の？",
    a:"「意味ない」は言い過ぎ。保湿成分入りの化粧水は実際に角質の水分を上げます。ただし<strong>単体だと持続が油分に劣る</strong>ので、後から乳液やオイルで“フタ”をするのが前提。化粧水は主役ではなく、肌を整える<strong>導入役</strong>です。" },
  { q:"高い化粧水ほど効くの？",
    a:"価格と効果は比例しません。加水分解していないコラーゲンや高分子ヒアルロン酸、プラセンタ、核酸などの<strong>大きな分子は角質層を通れず表面止まり</strong>（分子量およそ500を超えると入りにくい＝500ダルトンの目安／Bos & Meinardi, Exp Dermatol 2000）。値段より<strong>成分とバランス</strong>で選ぶのが正解です。" },
  { q:"「幹細胞」「成長因子」ってすごいの？",
    a:"化粧品に入るのは生きた幹細胞ではなく<strong>培養液エキス（培養上清）</strong>。塗って細胞が再生するわけではなく、作用は抗酸化やシグナルのサポートが中心です。成長因子（EGF等）も分子が大きく基本は<strong>浅い層まで</strong>。誇大な売り文句には注意を。" },
  { q:"バリア機能って何？",
    a:"肌表面の角質層は<strong>レンガ（角質細胞）とモルタル（細胞間脂質）</strong>のような構造。健康なら刺激を防ぎ水分を逃がしません。過剰な洗顔・アルコール・摩擦で脂質が壊れると水分が逃げて（TEWL上昇）乾燥や炎症に。<strong>セラミド</strong>はこのモルタルを補う成分です。" },
  { q:"どんな順番で塗ればいい？",
    a:"基本は<strong>水分 → 油分</strong>の順。脂性・混合肌は「化粧水 → ジェル →（夜）オイル少量」、乾燥肌は「化粧水 → 乳液 → オイル」。そして<strong>朝は最後に日焼け止め</strong>。これがどんな悩みにも共通する土台です。" },
];
