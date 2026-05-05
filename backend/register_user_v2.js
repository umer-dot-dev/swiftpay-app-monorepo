
const data = {
  full_name: 'Umer Sheraz',
  email: 'umer@gmail.com',
  password: 'Umer@900'
};

fetch('http://127.0.0.1:8787/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(res => res.json())
.then(json => console.log(json))
.catch(err => console.error(err));
