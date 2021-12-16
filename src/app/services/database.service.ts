import { Classifier, DecisionModel, Suggestion } from '../types/predict.types';
import { RejectResponse, ErrorResponse } from '../types/response.types';
import { Day, Month, Stock, Meta, Week } from '../types/stock.types';
import { get, post, put } from './axios.service';

export namespace Db {
  
  export async function getStockMetas() {
    let url = '/stock-metas';
    let r : any = await get(url).then(res => { return res; }, rej => { console.error(rej); return new RejectResponse(rej); }).catch(err => { console.error(err); return new ErrorResponse(err); });
    console.log(r);
    if(r?.error) throw new Error(r);
    else if(r?.data?.error) throw Error(r.data.error);
    else if(r?.data?.data) return r.data.data as Meta[];
    else throw new Error('Could not retrieve stock metas data from the database');
  }
  
  export async function pullStockMetas() : Promise<Meta[]> {
    let url = '/pull/stock-metas';
    let r : any = await get(url).then(res => { return res; }, rej => { console.error(rej); return new RejectResponse(rej); }).catch(err => { console.error(err); return new ErrorResponse(err); });
    if(r?.error) throw new Error(r);
    else if(r?.data?.error) throw Error(r.data.error);
    else if(r?.data?.data) return r.data.data as Meta[];
    else throw new Error('Could not retrieve stock meta data from Alpha Vantage');
  }

  export async function getStock(symbol : string) : Promise<Stock> {
    let url = '/stock/' + symbol;
    let r : any = await get(url).then(res => { return res; }, rej => { console.error(rej); return new RejectResponse(rej); }).catch(err => { console.error(err); return new ErrorResponse(err); });
    if(r?.error) throw new Error(r);
    else if(r?.data?.error) throw Error(r.data.error);
    else if(r?.data?.data) return r.data.data as Stock;
    else throw new Error('Could not retrieve stock data from the database for symbol ' + symbol);
  }

  export async function getDays(symbol : string) : Promise<Day[]> {
    let url = '/stock/days/' + symbol;
    let r : any = await get(url).then(res => { return res; }, rej => { console.error(rej); return new RejectResponse(rej); }).catch(err => { console.error(err); return new ErrorResponse(err); });
    if(r?.error) throw new Error(r);
    else if(r?.data?.error) throw Error(r.data.error);
    else if(r?.data?.data) return r.data.data as Day[];
    else throw new Error('Could not retrieve daily stock data from the database for symbol ' + symbol);
  }

  export async function pullDays(symbol : string) : Promise<Day[]> {
    let url = '/stock/days/' + symbol;
    let r : any = await get(url).then(res => { return res; }, rej => { console.error(rej); return new RejectResponse(rej); }).catch(err => { console.error(err); return new ErrorResponse(err); });
    if(r?.error) throw new Error(r);
    else if(r?.data?.error) throw Error(r.data.error);
    else if(r?.data?.data) return r.data.data as Day[];
    else throw new Error('Could not retrieve daily stock data from the database for symbol ' + symbol);
  }

  export async function getWeeks(symbol : string) : Promise<Week[]> {
    let url = '/stock/weeks/' + symbol;
    let r : any = await get(url).then(res => { return res; }, rej => { console.error(rej); return new RejectResponse(rej); }).catch(err => { console.error(err); return new ErrorResponse(err); });
    if(r?.error) throw new Error(r);
    else if(r?.data?.error) throw Error(r.data.error);
    else if(r?.data?.data) return r.data.data as Week[];
    else throw new Error('Could not retrieve weekly stock data from the database for symbol ' + symbol);
  }

  export async function pullWeeks(symbol : string) : Promise<Week[]> {
    let url = '/pull/weeks/' + symbol;
    let r : any = await get(url).then(res => { return res; }, rej => { console.error(rej); return new RejectResponse(rej); }).catch(err => { console.error(err); return new ErrorResponse(err); });
    if(r?.error) throw new Error(r);
    else if(r?.data?.error) throw Error(r.data.error);
    else if(r?.data?.data) return r.data.data as Week[];
    else throw new Error('Could not retrieve weekly stock data from the database for symbol ' + symbol);
  }

  export async function getMonths(symbol : string) : Promise<Month[]> {
    let url = '/stock/months/' + symbol;
    let r : any = await get(url).then(res => { return res; }, rej => { console.error(rej); return new RejectResponse(rej); }).catch(err => { console.error(err); return new ErrorResponse(err); });
    if(r?.error) throw new Error(r);
    else if(r?.data?.error) throw Error(r.data.error);
    else if(r?.data?.data) return r.data.data as Month[];
    else throw new Error('Could not retrieve monthly stock data from the database for symbol ' + symbol);
  }

  export async function pullMonths(symbol : string) : Promise<Month[]> {
    let url = '/pull/months/' + symbol;
    let r : any = await get(url).then(res => { return res; }, rej => { console.error(rej); return new RejectResponse(rej); }).catch(err => { console.error(err); return new ErrorResponse(err); });
    if(r?.error) throw new Error(r);
    else if(r?.data?.error) throw Error(r.data.error);
    else if(r?.data?.data) return r.data.data as Month[];
    else throw new Error('Could not retrieve monthly stock data from the database for symbol ' + symbol);
  }

  export async function getModel(symbol : string) : Promise<DecisionModel> {
    let url = '/model/' + symbol;
    let r : any = await get(url).then(res => { return res; }, rej => { console.error(rej); return new RejectResponse(rej); }).catch(err => { console.error(err); return new ErrorResponse(err); });
    if(r?.error) throw new Error(r);
    else if(r?.data?.error) throw Error(r.data.error);
    else if(r?.data?.data) return r.data.data as DecisionModel;
    else throw new Error('Could not retrieve decision model from the database for symbol ' + symbol);
  }

  export async function putModel(symbol : string, model : DecisionModel) : Promise<boolean> {
    let url = '/model/' + symbol;
    let body = { model: model };
    let r : any = await put(url, body).then(res => { return res; }, rej => { console.error(rej); return new RejectResponse(rej); }).catch(err => { console.error(err); return new ErrorResponse(err); });
    if(r?.error) throw new Error(r);
    else if(r?.data?.error) throw Error(r.data.error);
    else if(!r?.data?.error) return true;
    else throw new Error('Could not get suggestion of stock data from the database for symbol ' + symbol);
  }

  export async function trainModel(symbol : string) : Promise<DecisionModel> {
    let url = '/train/model/' + symbol;
    let r : any = await get(url).then(res => { return res; }, rej => { console.error(rej); return new RejectResponse(rej); }).catch(err => { console.error(err); return new ErrorResponse(err); });
    if(r?.error) throw new Error(r);
    else if(r?.data?.error) throw Error(r.data.error);
    else if(r?.data?.data) return r.data.data as DecisionModel;
    else throw new Error('Could not train decision model for symbol ' + symbol);
  }

  export async function predictModel(symbol : string, day : Day, week : Week, month : Month) : Promise<Classifier> {
    let url = '/predict/model/' + symbol;
    let body = { day: day, week: week, month: month};
    let r : any = await post(url, body).then(res => { return res; }, rej => { console.error(rej); return new RejectResponse(rej); }).catch(err => { console.error(err); return new ErrorResponse(err); });
    if(r?.error) throw new Error(r);
    else if(r?.data?.error) throw Error(r.data.error);
    else if(r?.data?.data) return r.data.data as Classifier;
    else throw new Error('Could not predict classifiers of data for symbol ' + symbol);
  }

  export async function validateModel(symbol : string) : Promise<Classifier> {
    let url = '/validate/model/' + symbol;
    let r : any = await get(url).then(res => { return res; }, rej => { console.error(rej); return new RejectResponse(rej); }).catch(err => { console.error(err); return new ErrorResponse(err); });
    if(r?.error) throw new Error(r);
    else if(r?.data?.error) throw Error(r.data.error);
    else if(r?.data?.data) return r.data.data as Classifier;
    else throw new Error('Could not validate decision model for symbol ' + symbol);
  }

  export async function testModel(symbol : string) : Promise<Classifier> {
    let url = '/test/model/' + symbol;
    let r : any = await get(url).then(res => { return res; }, rej => { console.error(rej); return new RejectResponse(rej); }).catch(err => { console.error(err); return new ErrorResponse(err); });
    if(r?.error) throw new Error(r);
    else if(r?.data?.error) throw Error(r.data.error);
    else if(r?.data?.data) return r.data.data as Classifier;
    else throw new Error('Could not test decision model for symbol ' + symbol);
  }

  export async function suggestModel(symbol : string, classifier : Classifier) : Promise<Suggestion> {
    let url = '/suggest/model/' + symbol;
    let body = { classifier: classifier };
    let r : any = await post(url, body).then(res => { return res; }, rej => { console.error(rej); return new RejectResponse(rej); }).catch(err => { console.error(err); return new ErrorResponse(err); });
    if(r?.error) throw new Error(r);
    else if(r?.data?.error) throw Error(r.data.error);
    else if(r?.data?.data) return r.data.data as Suggestion;
    else throw new Error('Could not get suggestion of stock data from the database for symbol ' + symbol);
  }
}