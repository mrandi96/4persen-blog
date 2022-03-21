import { admin } from 'utility/firebase';

const bucket = admin.storage().bucket(process.env.FS_BUCKET);

async function getMarkdownByName(name) {
  const signedUrl = await bucket.file(`Markdown/${name}.md`).getSignedUrl({
    action: 'read',
    expires: new Date(new Date().setDate(new Date().getDate() + 1))
  });

  const response = await fetch(signedUrl);
  const content = await response.text();

  return content;
}

async function uploadMarkdown(content, markdownText) {
  const file = bucket.file(`Markdown/${content}.md`);
  file.save(markdownText, {
    contentType: 'text/plain'
  });

  return true;
}

export {
  getMarkdownByName,
  uploadMarkdown
}

export default async function handler(req, res) {
  const { name } = req.query;
  const content = await getMarkdownByName(name);

  return res.status(200).send(content);
}
