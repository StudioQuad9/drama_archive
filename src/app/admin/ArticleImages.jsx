import ImageUpload, { ImagePreview } from "./ImageUpload";
import styles from "./admin.module.scss";

export default function ArticleImages({ values, onChange, disabled, userId, onMainBusy, onExtraBusy, uploadBusy }) {
  function change(event) {
    const { name, value } = event.target;
    onChange({ ...values, [name]: value });
  }
  return (
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
  );
}
