import AWS from "aws-sdk";

export const uploadToS3 = async (file, userId, folderName) => {
  AWS.config.update({
    credentials: {
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET,
    },
  }); // 설정하여 AWS에 로그인하기

  const { filename, createReadStream } = await file;
  const readStream = createReadStream();
  const objectName = `${folderName}/${userId}-${Date.now()}-${filename}`; // AWS에 폴더명 만들어서 파일 넣음
  const { Location } = await new AWS.S3()
    .upload({
      Bucket: "instaclone-uploads-shin", // AWS에서 만든 bucket 이름 작성
      Key: objectName, // 파일명 지정
      ACL: "public-read", // object의 프라이버시를 말한다. 아무나 read를 할 수 있다.
      Body: readStream,
    })
    .promise(); // update가 콜백을 써야하는데 대신 await promise 사용가능
  return Location; // 데이터베이스에 AWS 파일 위치 저장
};
