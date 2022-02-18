export const processHashtags = (caption) => {
  const hashtags = caption.match(/#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/g) || []; // 정규표현식을 이용하여 매치하여 문장에서 해쉬태그만 추출, 해시태그가 없으면 []반환

  return hashtags.map((hashtag) => ({
    where: { hashtag },
    create: { hashtag },
  }));
};
