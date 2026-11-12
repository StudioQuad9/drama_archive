import ImageUpload, { ImagePreview } from "./ImageUpload";
import styles from "./admin.module.scss";

const numbers = [
  { name: "score", label: "評価（0〜10）", min: 0, max: 10 },
  { name: "seasons", label: "シーズン数", min: 1 },
  { name: "year", label: "作品の年", min: 1, max: 9999 },
];
const lists = [
  { name: "genres", label: "ジャンル", example: "Crime\nMystery" },
  { name: "platforms", label: "配信先", example: "HBO\nNetflix" },
];

export default function DramaFields({ values, onChange, disabled, userId, onMainBusy, onExtraBusy, uploadBusy }) {
  function change(event) {
    const { name, value, checked, type } = event.target;
    onChange({ ...values, [name]: type === "checkbox" ? checked : value });
  }
  return (
    <>
      <fieldset className={styles.metadataGroup} disabled={disabled || uploadBusy}>
        <legend>作品情報</legend>
        <p>下書きでは未入力でも保存できます。</p>
        <div className={styles.numberFields}>
          {numbers.map(({ name, label, min, max }) => (
            <div key={name}>
              <label htmlFor={`drama-${name}`}>{label}</label>
              <input id={`drama-${name}`} name={name} type="number" min={min} max={max} step="1" value={values[name]} onChange={change} />
            </div>
          ))}
        </div>
        {lists.map(({ name, label, example }) => (
          <div key={name}>
            <label htmlFor={`drama-${name}`}>{label}（1行に1項目）</label>
            <textarea id={`drama-${name}`} name={name} rows={3} placeholder={example} value={values[name]} onChange={change} />
          </div>
        ))}
        <label className={styles.checkboxLabel}>
          <input name="featured" type="checkbox" checked={values.featured} onChange={change} />
          Featuredに指定する
        </label>
        <p>表示への反映は公開機能の追加後に行います。</p>
      </fieldset>
      <fieldset className={styles.metadataGroup} disabled={disabled || uploadBusy}>
        <legend>引用と動画</legend>
        <label htmlFor="drama-quote">引用文</label>
        <textarea id="drama-quote" name="quote" rows={3} value={values.quote} onChange={change} />
        <label htmlFor="drama-quoteBy">引用者</label>
        <input id="drama-quoteBy" name="quoteBy" value={values.quoteBy} onChange={change} />
        <label htmlFor="drama-youtubeId">YouTube動画ID</label>
        <input id="drama-youtubeId" name="youtubeId" value={values.youtubeId} onChange={change} placeholder="jdu3hAAmFtk" aria-describedby="youtube-help" />
        <p id="youtube-help">動画URLの v= の後などにある11文字のIDです。</p>
      </fieldset>
      <fieldset className={styles.metadataGroup} disabled={disabled}>
        <legend>画像</legend>
        <p>ファイルを選ぶとアップロードが始まります。完了後に下書き保存を押してください。</p>
        <ImageUpload userId={userId} label="メイン画像をアップロード" value={values.image} disabled={disabled || uploadBusy} onBusyChange={onMainBusy} onUploaded={(reference) => onChange({ ...values, image: reference })} />
        <ImageUpload userId={userId} label="追加画像をアップロード（1枚ずつ）" value="" disabled={disabled || uploadBusy} onBusyChange={onExtraBusy} onUploaded={(reference) => onChange({ ...values, subImages: [values.subImages.trim(), reference].filter(Boolean).join("\n") })} />
        <label htmlFor="drama-image">メイン画像</label>
        <input id="drama-image" name="image" disabled={uploadBusy} value={values.image} onChange={change} placeholder="/pict/truedetective.avif" />
        <label htmlFor="drama-subImages">追加画像（1行に1画像）</label>
        <textarea id="drama-subImages" name="subImages" disabled={uploadBusy} rows={3} value={values.subImages} onChange={change} placeholder="/pict/truedetective_sub1.webp" />
        {values.subImages.split(/\r?\n/).map((value) => value.trim()).filter(Boolean).map((value, index) => <ImagePreview key={`${index}-${value}`} value={value} />)}
      </fieldset>
    </>
  );
}
