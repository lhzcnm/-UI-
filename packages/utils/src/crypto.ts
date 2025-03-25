import JSEncrypt from 'jsencrypt'

export function encrypt(data: string) {
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey('MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwUCnr6vIdja/v5xTCKAErRWakiJo5H8Kn0sBsh8HhHS2rtX5Zx6YJ+/6t2of31S2TaaZy1AXxuCyLCTiGa/sttLLoN/zl9j5brURopM1n7fYsjWyGcmEzcG/+ngdVH7xz1ug9dzSNGHI2+Spj/bNzeEGyMb7+9Gsj8zv9W6WraFZ22xNbpOxreQqbOAYXCOV75bg4Li1eem4T4yYNbol3fvMt559RcvA7m/iQ3zttPIsA3fMu76a2lWwl7h/CnDntrLyuvoy9eimTISjm4bjmjgqxlOg7QwjrfQx+zeW5oXLZGc8kgNWJ+jt1Dmg68tX25QkzCzg/kQY54dASt6I6QIDAQAB')
  return encrypt.encrypt(data)
}
