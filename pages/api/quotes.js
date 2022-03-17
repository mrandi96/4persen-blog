// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

async function getOneRandomQuote() {
  const response = await fetch('https://type.fit/api/quotes');
  const data = await response.json();
  const index = Math.floor(Math.random() * data.length);

  return data[index];
}

export {
  getOneRandomQuote
}

export default async function handler(req, res) {
  const quote = await getOneRandomQuote();

  return res.status(200).json(quote);
}
