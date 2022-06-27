const generateToken=()=>{
  const randomToken=Math.random().toString(32).substring(2);

  const fecha=Date.now().toString(32);
  return randomToken+fecha;
}

module.exports={generateToken};