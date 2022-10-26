import * as jose from 'jose'

// openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout privatekey.key -out certificate.crt
const generatePublicKey = async() => {
  
  const algorithm = 'ES256'
  const x509 = `-----BEGIN CERTIFICATE-----
  MIIECzCCAvOgAwIBAgIUHgLG0hmog6fP3+LsXN/IaSo2te0wDQYJKoZIhvcNAQEL
  BQAwgZQxCzAJBgNVBAYTAlBIMRkwFwYDVQQIDBBNaXNhbWlzIE9yaWVudGFsMRcw
  FQYDVQQHDA5DYWdheWFuIGRlIE9ybzESMBAGA1UECgwJTGVtb25kcm9wMQ8wDQYD
  VQQLDAZzZWN0b3IxDzANBgNVBAMMBnNhbm9rZTEbMBkGCSqGSIb3DQEJARYMbWVA
  Z21haWwuY29tMB4XDTIyMTAyMTAwNTIzNFoXDTIzMTAyMTAwNTIzNFowgZQxCzAJ
  BgNVBAYTAlBIMRkwFwYDVQQIDBBNaXNhbWlzIE9yaWVudGFsMRcwFQYDVQQHDA5D
  YWdheWFuIGRlIE9ybzESMBAGA1UECgwJTGVtb25kcm9wMQ8wDQYDVQQLDAZzZWN0
  b3IxDzANBgNVBAMMBnNhbm9rZTEbMBkGCSqGSIb3DQEJARYMbWVAZ21haWwuY29t
  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4+RxQ9G1UVWlbcZ33m8f
  j8oFVXvG+XzLcHHNqHb8z+KM19rEBy6lBAQI5I3qdHt5eoA3yUz9LCKWe9cg4oQx
  YRruupbmR78KwJ9xTeGaw/fdWpLl+9yAvl+qqFf/IZtvBF0lXJNjVZym3irO9he6
  jmqUWMWQ6lqPBc2qIUQx0GFirOzqIg/U64DlM+1jbcp8aEu/Krd4C0p97FwkGkKc
  gMNM75ed93H3CIWjLI4WcAHrSzQ2hQWwBx/YrT5tS3Sd7lN40v/faqhLduJn39Fr
  +/MSarOnqQ4+GwB9KlfW/vjEYnuTFSKjFYwgKX3QJiejuL0H6rg1IaP1Bs8R6Ib+
  UwIDAQABo1MwUTAdBgNVHQ4EFgQU0PhJP+qBj99fwpGk051NPcJSL7owHwYDVR0j
  BBgwFoAU0PhJP+qBj99fwpGk051NPcJSL7owDwYDVR0TAQH/BAUwAwEB/zANBgkq
  hkiG9w0BAQsFAAOCAQEABOR+KnSKavxBGFAeN6jTNOmAl4zV3GrAuBC1W50IHsFR
  G6PU0Gh6pryMdMen+tq/tucwCIXZA8DK5q/kCNo1nSFgHpRBvTjCqhxGrscWhTCy
  mTfOJSMCsQmy/0tH+7cOlCsdSw8139jWTM7YO8jHkz10R5jtZ2EiiPJiGw1Vieot
  w1+ntlPCx3mnIaDts6pnXGWbFjaQAqo/l2aYhRDGOluzE7JZZuRu72muSv9Ve7Pc
  D7kmHSlPhspJksxcLPswt/GD0WrMkP27cifzin0hPx646JSAcrAh4xZsnA00B2pf
  KRI7LUu++6BC4Pl9Jy0kMlGJC/owFA0MR/oFG/0Qsw==
  -----END CERTIFICATE-----`
  return await jose.importX509(x509, algorithm)
}
const generatePrivateKey = async() => {
  
  const algorithm = 'ES256'
  const x509 = `-----BEGIN PRIVATE KEY-----
  MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDj5HFD0bVRVaVt
  xnfebx+PygVVe8b5fMtwcc2odvzP4ozX2sQHLqUEBAjkjep0e3l6gDfJTP0sIpZ7
  1yDihDFhGu66luZHvwrAn3FN4ZrD991akuX73IC+X6qoV/8hm28EXSVck2NVnKbe
  Ks72F7qOapRYxZDqWo8FzaohRDHQYWKs7OoiD9TrgOUz7WNtynxoS78qt3gLSn3s
  XCQaQpyAw0zvl533cfcIhaMsjhZwAetLNDaFBbAHH9itPm1LdJ3uU3jS/99qqEt2
  4mff0Wv78xJqs6epDj4bAH0qV9b++MRie5MVIqMVjCApfdAmJ6O4vQfquDUho/UG
  zxHohv5TAgMBAAECggEAFjhR6uDpovKM3LU7Ps7q7uQtvPYCopTOaTpPaRug7swS
  G4HTFzgvEsMp8s77izv2zkDuL4x4KvN8ZLrHFA77mZI8sKjB70DrVXi2XXef1Xe3
  d3tXPUV0sBs30o4x7B7xpiVG3U3po5FQm9zkrQ4HPJebu0QYKyGFTHWPHws9KCoH
  kOftkO4dWWvyafGGNPnTyvRwlvNCw5VNPFGZWAMS/vnxWDYSO3cbSZBbRdhG7d9i
  vF51i8My9RTh3UufNAv3YyDXFoPpT6W2twoBGoNWYhPCIfoDLw9HTDVGbDaOnj7O
  tQTBds/+wFYKcShO4hPA0HFqbj70l/FcaPVf7ubqkQKBgQDycSzPC/eRKm5ic4N9
  ymcmFt7kirpqqohmXj7ETFA6rZaqtfbX2CsqCrUYeiOrROUf7eeQ+8OzE/CIe7Me
  o4Nwd6nr9f70PXFlKtEiNFt47L8xg4S4YuhyphWJFbyjiEemNJdZ/47gU6yHGpqA
  uCfuaV+toIU/dDV5bmd4+IewNwKBgQDwovjQxp+Vvae14DnQ3aM/DOiqaf123njT
  JLd38BA6ez1JcLKLP6xzEGr9WRgZWsY8HEUeRqTVb921OWrBpiHqmGLKgWFldyEC
  yqLvHSQGjaJxYSDJQHCyju9+zDbFVue5oQ2MWgaY/7LG133KPwUe/L8SB8zENEi6
  zSK78Oy8xQKBgQCzkYnrzORQHApoV0CUQf8GYjgzNGGAsdCXacS5pgBihcIrrN0o
  386QtB+QAp86squ2a4Jxi1hW4jTtEhoIXnnzKl6sC6cMBhpgIUeHOxppRYkTRmNe
  IrwidstKntP6l+zhuOBFY5jSpIcMBnNbVYsV9exM8LDg39TfnRt8qS/vHwKBgDsK
  waH4Gg/TiOLHMWhd+T/vGuc1OkuAKoUj7SAwdsrikhcC38vqw5U34ghnY9JUw27c
  QNk83BTCbdOZUuhQquG0ogit1gffQuo8bd3deIljFwhanIDEnuIwz/J8iLPCrviM
  25YkQJopouPG28ZT0B3aRcdWwpchfPbYfj0+z9dBAoGBAIbDUqvxU2uAtHfRucZW
  wfY6r/m1FONLbBPvZ80+3Unav8nwGaS4v/i7PpiBsFJH0T5od21dM2Vtdp+rlqmG
  ndR3OXmLEJePRoVQ6wjvj18gdFufnJF5f1mo3oCY9EqD0MKoDJJG/j7b14opyE4K
  vleBCSprWA8uigaF5DukplfL
  -----END PRIVATE KEY-----`
  return await jose.importPKCS8(x509, algorithm)
}
// 

const secretKey = new TextEncoder().encode(
  "Swe4g7c?UBm5Nrd96vhsVDtkyJFbqKMTm!TMw5BDRLtaCFAXNvbq?s4rGKQSZnUP"
)


const encrypt =async () => {
  const ebPrivateKey = await generatePrivateKey()
  const jwt = await new jose.SignJWT({ 'urn:example:claim': true, 'sub': JSON.stringify( {'name': 'Marie'}) })
  .setProtectedHeader({ alg: 'RS256', typ: 'jwt' })
  .setIssuedAt()
  .setIssuer('lemodrop')
  .setAudience('lemodrop')
  .setExpirationTime('2h')
  //RS256
  .sign(ebPrivateKey)
  // HS256
  // .sign(secretKey)

  return  jwt

}

const verify = async (token: string) => {
  //RS256
  const publicKey = await generatePublicKey()
  //HS256
  // const publicKey = secretKey
  const { payload, protectedHeader } = await jose.jwtVerify(token, publicKey, {
    issuer: 'lemodrop',
    audience: 'lemodrop',
  })
  
  console.log(protectedHeader)
  console.log(payload)
  
}

const main =async () => {
  const token = await encrypt()
  console.log(token)

  verify(token)
}

main()