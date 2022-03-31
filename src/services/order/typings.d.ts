declare namespace OrderAPI {
    export interface CapitalList {
        id: number;
        isDeleted: number;
        version: number;
        createTime: string;
        updateTime: string;
        applicationId: string;
        creditOrgId: string;
        clearingOrgId: string;
        leaseId: string;
        shortName: string;
        merName: string;
        merEmail: string;
        merLicense: string;
        merAddress: string;
        legalIdcardFront: string;
        legalIdcardAfter: string;
        idCardNumber: string;
        legalPerson: string;
        legalPersonPhone: string;
        merPostcode: string;
        merUserId: string;
        merAccountId: string;
        merSealId: string;
        officialSeal: string;
        serviceCode: string;
        contractServiceCode: string;
        twcServiceCode: string;
        contractSignFlag: number;
        username: string;
        password: string;
        status: number;
        type: number;
        smsMobile: string;
        signAgree: number;
        configInfo: string;
        divisionRateConfig: string;
    }

    export interface OrderCapitalParams {
        pageSize: number,
        pageNo: number
    }

    export interface ListCapital {
        orderId: number;
        capitalName: string;
        capitalRentId: string;
        capitalId: number;
        reportTime: string;
        reportAmt: number;
        transactionId: string;
        applicationId: string;
        clearingOrgId: string;
        reportStatus: number;
        reportTwc: number;
        reportTwcTime: string;
        extInfo: string;
        orderAmt: number;
        orderAmtTime: string;
        capitalTailAmt: number;
        policyNo: string;
        policyUrl: string;
        name: string;
        mobile: string;
        loanNo: string;
        idCard: string;
        brand: string;
        contractUrl: string;
    }

    export interface CapitalListData {
        count: number;
        capitalList: CapitalList[];
        list: ListCapital[];
    }

    export interface OrderCapitalItem {
        code: number;
        success: boolean;
        message: string;
        data: CapitalListData;
    }

    
}