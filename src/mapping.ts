import { BigInt,ipfs, json,log } from "@graphprotocol/graph-ts"
import {
  Contract,
  CreateItem,
  Transfer,
} from "../generated/Contract/Contract"
import { NFT, Holder, Traits } from "../generated/schema"


export function handleCreateItem(event: CreateItem): void {
  let id = event.params.id
  let contract = Contract.bind(event.address)
  let nft = new NFT(id.toHexString())
  nft.index = id.toI32()
  
  let owner = contract.ownerOf(id)

  let holder = Holder.load(owner.toHexString())

  if(!holder){
   holder = new Holder(owner.toHexString())
  }
  nft.owner = owner.toHexString()

  nft.image = "ipfs://QmTn3yDrwJgVS13eD5uhUKB4mxuQYDq78FihGa5W3YvCiV/" + id.toString() + ".png"

 

  let metadata = ipfs.cat("Qme1vxGNw9Wuh7RM3y6p5VvQWzui1gyMb3RfLoWcst3M8n/" + id.toString());

  if (metadata){
    let value = json.fromBytes(metadata).toObject()
    let attributes = value.get("attributes")
    if (attributes){
     let arr = attributes.toArray()

      //dde
      let traits = Traits.load(event.transaction.hash.toHexString())

      if (!traits){
        traits = new Traits(event.transaction.hash.toHexString())
      }

      for (let i = 0; i < arr.length; ++i){

      let obj = arr[i].toObject()
      let traitTypeJson = obj.get('trait_type')
      let traitType = ""
      if (traitTypeJson){
         traitType = traitTypeJson.toString()
      } 
      
      if (traitType == 'Background'){
        let value = obj.get('value')
        if(value){
          traits.Background = value.toString()
        }
      }
      if (traitType == 'Body'){
        let value = obj.get('value')
        if(value){
          traits.Body = value.toString()
        }
      }
      if (traitType == 'Skin'){
        let value = obj.get('value')
        if(value){
          traits.Skin = value.toString()
        }
      }
      if (traitType == 'Faces'){
        let value = obj.get('value')
        if(value){
          traits.Faces = value.toString()
        }
      }
      if (traitType == 'Headwear'){
        let value = obj.get('value')
        if(value){
          traits.Headwear = value.toString()
        }
      }
      if (traitType =='Piercing'){
        let value = obj.get('value')
        if(value){
          traits.Piercing = value.toString()
        }
      }
      if (traitType == 'Fomies'){
        let value = obj.get('value')
        if(value){
          traits.Fomies = value.toString()
        }
      }
      if (traitType == 'Sparkles'){
        let value = obj.get('value')
        if(value){
          traits.Sparkles = value.toString()
        }
      }
    }
      traits.save()
  }
  }

  nft.traits = event.transaction.hash.toHexString()

  holder.save()
  nft.save()

}


export function handleTransfer(event: Transfer): void {
  let newOwner = event.params.to
  let token = event.params.tokenId

  let nft = NFT.load(token.toHexString())

  if(nft){
  nft.owner = newOwner.toHexString()
  
  nft.save()
  }

}

