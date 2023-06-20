import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { getNews } from "../../api/external";
import Loader from "../../components/Loader/Loader";

export default function Home() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    (async function newsApiCall() {
      const response = await getNews();

      setArticles(response);
    })();

    //cleanUp function
    setArticles([]);
  }, []);

  const handleClick = (url) =>{
    window.open(url, '_blank')
  }

  if(articles.length === 0){
    return <Loader text='homepage' />
  }
  return (
      <div>
           <div className={styles.header}>Latest Articles</div>
           <div className={styles.grid}>
            {articles.map((article) =>(
            <div className={styles.card} key={article.url} onClick={ () => handleClick(article.url)}>
              <img src={article.urlToImage} alt="news blog"/> 
              <h3>{article.title}</h3>
            </div>
            ))}
           </div>
      </div>
  );
}
