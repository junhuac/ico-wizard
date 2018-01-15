import { action, computed, observable } from 'mobx'

class DeploymentStore {
  @observable txSuccessful
  @observable txRequired
  @observable failureReason = null

  constructor () {
    /**
     01 safeMathLibrary                         - contract deployment
     02 Token                                   - contract deployment
     03 PricingStrategy                         - contract deployment
     04 Crowdsale                               - contract deployment
     05 CrowdsaleAddress                        - method call
     06 FinalizeAgent                           - contract deployment
     07    LastCrowdsale                        - method call
     08*   ReservedTokensListMultiple           - method call
     09    UpdateJoinedCrowdsale                - method call
     10    MintAgentRecursive (crowdsale)       - method call
     11    MintAgentRecursive (finalizeAgent)   - method call
     12*   Whitelist                            - method call
     13    FinalizeAgent                        - method call
     14    ReleaseAgent                         - method call
     15    transferOwnership                    - method call
     * depends on the configuration
     */
    [
      'safeMathLibrary',
      'token',
      'pricingStrategy',
      'crowdsale',
      'registerCrowdsaleAddress',
      'finalizeAgent',
      'lastCrowdsale',
      'setReservedTokens',
      'updateJoinedCrowdsales',
      'setMintAgentCrowdsale',
      'setMintAgentFinalizeAgent',
      'whitelist',
      'setFinalizeAgent',
      'setReleaseAgent',
      'transferOwnership'
    ].forEach(tx => {
      this.txSuccessful.set(tx, false)
      this.txRequired.set(tx, true)
    })
  }

  @action setAsRequired = (txName) => {
    this.txRequired.set(txName, true)
  }

  @action setAsNotRequired = (txName) => {
    this.txRequired.set(txName, false)
  }

  @action setAsSuccessful = (txName) => {
    this.txSuccessful.set(txName, true)
  }

  @action setAsNotSuccessful = (txName) => {
    this.txSuccessful.set(txName, false)
  }

  @action setFailureReason = (reason) => {
    this.failureReason = reason
  }

  @computed get deploymentHasFinished () {
    let success = true

    for (let [tx, successful] of this.txSuccessful) {
      if (this.txRequired.get(tx)) success &= successful
      if (!success) return success
    }

    return success
  }

  @computed get nextPendingTransaction () {
    for (let [tx, successful] of this.txSuccessful) {
      if (this.txRequired.get(tx) && !successful) return tx
    }

    return ''
  }
}

const deploymentStore = new DeploymentStore()

export default deploymentStore
export { DeploymentStore }
