# 第8章　共通モーダルの基本を導入する

## 目的

作品ごとに存在したモーダルHTMLを、一つの共通モーダルへ置き換えます。

## 1. 選択中の作品をstateにする

```jsx
// src/components/drama/DramaArchive.jsx
"use client";

import { useState } from "react";
import { dramas } from "@/data/dramas";
import DramaList from "./DramaList";
import DramaDetail from "./DramaDetail";
import Modal from "@/components/ui/Modal";

export default function DramaArchive() {
  const [selectedDrama, setSelectedDrama] = useState(null);

  const featuredDrama = dramas.find((drama) => drama.featured);
  const listedDramas = dramas.filter((drama) => !drama.featured);

  const closeModal = () => setSelectedDrama(null);

  return (
    <>
      {/* FeaturedにもsetSelectedDramaを渡す */}
      <DramaList dramas={listedDramas} onSelect={setSelectedDrama} />

      <Modal
        isOpen={selectedDrama !== null}
        onClose={closeModal}
        animation="fadeUp"
        size="lg"
        placement="center"
        ariaLabel={selectedDrama ? `${selectedDrama.title}のレビュー` : "作品レビュー"}
      >
        {selectedDrama && (
          <DramaDetail drama={selectedDrama} onClose={closeModal} />
        )}
      </Modal>
    </>
  );
}
```

モーダルの開閉を表す別のBoolean値は持ちません。

```text
selectedDrama === null → 閉じている
selectedDramaに作品がある → その作品を開いている
```

状態を二重に持たないことで、矛盾を防ぎます。

## 2. Portal

モーダルは見た目上ページ全体を覆います。`createPortal`を使うと、コンポーネントの呼び出し位置に関係なく`document.body`直下へ描画できます。

```jsx
import { createPortal } from "react-dom";

return createPortal(modal, document.body);
```

ただし、`document`はブラウザにしかありません。そのため、共通ModalはClient Componentにします。

## 今日の確認

- [ ] すべての作品が一つのModalを共有している
- [ ] 選択作品によって内容が変わる
- [ ] 背景クリックで閉じる
- [ ] 作品データとModalの枠が分離している

## Git

```bash
git add .
git commit -m "Add reusable drama modal"
```
