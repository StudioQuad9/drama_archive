import FeaturedStatus from "./FeaturedStatus";
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

export default function DramaFields({ values, onChange, disabled, uploadBusy, featuredRefresh }) {
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
          トップの特集にする
        </label>
        <FeaturedStatus refresh={featuredRefresh} requested={values.featured} />
      </fieldset>
      <fieldset className={styles.metadataGroup} disabled={disabled || uploadBusy}>
        <legend>動画と特集用の引用</legend>
        <label htmlFor="drama-youtubeId">YouTube動画ID</label>
        <input id="drama-youtubeId" name="youtubeId" value={values.youtubeId} onChange={change} placeholder="jdu3hAAmFtk" aria-describedby="youtube-help" />
        <p id="youtube-help">動画URLの v= の後などにある11文字のIDです。</p>
        <label htmlFor="drama-quote">引用文（特集用・任意）</label>
        <textarea id="drama-quote" name="quote" rows={3} value={values.quote} onChange={change} />
        <label htmlFor="drama-quoteBy">引用者（特集用・任意）</label>
        <input id="drama-quoteBy" name="quoteBy" value={values.quoteBy} onChange={change} />
      </fieldset>

    </>
  );
}
