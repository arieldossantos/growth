import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  vus: 100,
  duration: '30s',
  iterations: 100
};

export default function () {
  const headers = { 'Content-Type': 'application/json' };
  const dataPut = { value: 333.98 }
  const dataPost = [
                      {
                         "Country":"BRZ",
                         "Indicator":"NGDP_R",
                         "Value":183.26,
                         "Year":2002
                      },
                      {
                         "Country":"AFG",
                         "Indicator":"NGDP_R",
                         "Value":198.736,
                         "Year":2003
                      }
                   ]

    var resGetPing = http.get('http://localhost:8080/ping');
    var resGetStatus = http.get('http://localhost:8080/api/v1/growth/post/status');
    var resGet = http.get('http://localhost:8080/api/v1/growth/brz/ngdp_r/2002');
     var resPut = http.put(
          'http://localhost:8080/api/v1/growth/brz/ngdp_r/2002',
          JSON.stringify(dataPut),
          { headers }
        );
    var resPost = http.post(
                           'http://localhost:8080/api/v1/growth',
                           JSON.stringify(dataPost),
                           { headers }
                         );
    var resDelete = http.del('http://localhost:8080/api/v1/growth/brz/ngdp_r/2002');
    var resGetSize = http.get('http://localhost:8080/api/v1/growth/size');


    check(resGetPing, {
            'get status is status 200': (r) => r.status === 200,
    });

    check(resGetStatus, {
        'get status is status 200': (r) => r.status === 200,
    });

    check(resGetSize, {
        'get size is status 200': (r) => r.status === 200,
    });

    check(resGet, {
        'get growth id is status 200': (r) => r.status === 200,
    });

    check(resDelete, {
        'delete entity is status 202': (r) => r.status === 202,
    });

    check(resPut, {
          'update field id is status 202': (r) => r.status === 202,
      });

      check(resPost, {
                'post fields is status 202': (r) => r.status === 202,
            });

  sleep(1);
}