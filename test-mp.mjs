import { MercadoPagoConfig, Preference } from 'mercadopago';


console.log("Token:", process.env.MP_ACCESS_TOKEN ? process.env.MP_ACCESS_TOKEN.substring(0, 15) + '...' : 'MISSING');

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN?.trim() || ''
});

async function run() {
  try {
    const preference = new Preference(client);
    const response = await preference.create({
      body: {
        items: [
          {
            id: '1',
            title: 'Flor',
            quantity: 1,
            unit_price: 10000,
            currency_id: 'CLP',
          }
        ],
        back_urls: {
          success: 'http://localhost:3000',
          failure: 'http://localhost:3000',
          pending: 'http://localhost:3000',
        },
        auto_return: 'approved',
      }
    });
    console.log("SUCCESS! URL:", response.init_point);
  } catch (error) {
    console.error("ERROR:");
    console.error(error);
  }
}
run();
