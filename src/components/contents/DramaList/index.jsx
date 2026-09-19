// @/components/contents/DramaList/index.jsx

import Image from "next/image";

export default function DramaList() {
  return (
    <>
      <section id="dramas">
        <h2 className="heading2">Dramas</h2>

        <ul className="list">
          <li className="item">
            <article className="card">
              <div className="img-wrapper">
                <Image 
                  src="/pict/strangerthings.avif"
                  alt="Stranger Things"
                  width={1920}
                  height={1076}                
                />
              </div>

              <p className="score">
                9/10
              </p>

              <div className="body">
                <div className="heading">
                  <span className="order">

                  </span>
                  <h3 className="title">
                    Stranger Things
                  </h3>
                </div>

                <p className="infomation">
                  5 seasons / SF ∙ Juvenile
                  <br />
                  2016 / NETFLIX
                </p>
              </div>
            </article>
          </li>
        </ul>
      </section>
    </>
  );
}

{/* 
::::: origin html :::::
<section id="dramas">
  <h2>Dramas</h2>

  <div className="drama-cards">
    <article
      className="drama open-modal"
      data-modal="modal-stranger-things"
    >
      <div className="flex">
        <div className="thumbnail">
          <Image
            src="/pict/strangerthings.avif"
            alt="Stranger Things"
            width={1920}
            height={1076}
          />
        </div>
        <h4></h4>
        <p className="score"></p>
      </div>
      <p className="information">
        5 seasons / SF ∙ Juvenile
        <br />
        2016 / NETFLIX
      </p>
    </article>
  </div>
</section>
  */}

// :::::: my code :::::
// import DramaCard from "./DramaCard";
// import styles from "./DramaList.module.scss";

// export default function DramaList({ dramas }) {
//   return (
//     <section id="dramas">
//       <h2 className={styles.heading2}>Dramas</h2>

//       <ul className={styles.list}>
//         {dramas.map((drama, index) => (
//           <li
//             key={drama.id}
//             className={styles.item}
//           >
//             <DramaCard
//               drama={drama}
//               order={index + 1}
//               />
//           </li>
//         ))}
//       </ul>
//     </section>
//   );
// }