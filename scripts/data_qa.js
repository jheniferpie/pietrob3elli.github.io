// Data QA utilities for rheology dashboard
// Provides functions: detectNumericColumns, normalizeRowValues, parseNumber, detectMissingValues,
// detectOutliersIQR, generateQAReport, filterRowsByValidity, exportCSV
// Attached to window.DataQA for easy use in non-module pages

(function(){
  function parseNumber(val){
    if(val === null || val === undefined) return NaN;
    if(typeof val === 'number') return val;
    var s = String(val).trim();
    if(s === '') return NaN;
    // Replace comma decimal with dot and remove thousands separators (common heuristics)
    // Remove spaces
    s = s.replace(/\s+/g,'');
    // If it contains both '.' and ',', decide by last occurrence
    if(s.indexOf(',')>-1 && s.indexOf('.')>-1){
      if(s.lastIndexOf(',') > s.lastIndexOf('.')){
        s = s.replace(/\./g,'').replace(/,/g,'.');
      } else {
        s = s.replace(/,/g,'');
      }
    } else {
      s = s.replace(/,/g,'.');
    }
    // strip any non numeric except dot and e/E and +-
    s = s.replace(/[^0-9\.\+\-eE]/g,'');
    var n = Number(s);
    return isFinite(n) ? n : NaN;
  }

  function detectNumericColumns(headers, rows, sampleSize){
    sampleSize = sampleSize || Math.min(50, rows.length);
    var result = {};
    headers.forEach(h=> result[h] = {numericCount:0, total:0});
    var sample = rows.slice(0,sampleSize);
    sample.forEach(r=>{
      headers.forEach(h=>{
        var v = r[h];
        if(v===undefined || v===null || String(v).trim()===''){
          result[h].total += 1; // still count as seen
          return;
        }
        var n = parseNumber(v);
        result[h].total += 1;
        if(!isNaN(n)) result[h].numericCount += 1;
      });
    });
    // classify as numeric if >= 70% of non-empty samples are numeric
    var classified = {};
    headers.forEach(h=>{
      var meta = result[h];
      var ratio = meta.total > 0 ? (meta.numericCount / meta.total) : 0;
      classified[h] = {isNumeric: ratio >= 0.7, numericRatio: ratio, numericCount: meta.numericCount, total: meta.total};
    });
    return classified;
  }

  function normalizeRowValues(row){
    var out = {};
    Object.keys(row).forEach(k=>{
      var v = row[k];
      if(v === null || v === undefined) out[k] = '';
      else out[k] = (''+v).trim();
    });
    return out;
  }

  function detectMissingValues(headers, rows){
    var missing = {};
    headers.forEach(h=> missing[h] = 0);
    rows.forEach(r=>{
      headers.forEach(h=>{
        var v = r[h];
        if(v === null || v === undefined || String(v).trim()==='') missing[h]++;
      });
    });
    return missing;
  }

  // Outlier detection using IQR on numeric column values
  function detectOutliersIQR(headers, rows, numericCols){
    var stats = {};
    numericCols.forEach(col=>{
      var vals = rows.map(r=> parseNumber(r[col])).filter(v=>!isNaN(v));
      vals.sort((a,b)=>a-b);
      if(vals.length < 4){ stats[col] = {count:vals.length, outliers: []}; return; }
      var q1 = quantile(vals, 0.25);
      var q3 = quantile(vals, 0.75);
      var iqr = q3 - q1;
      var lower = q1 - 1.5 * iqr;
      var upper = q3 + 1.5 * iqr;
      var outliers = [];
      vals.forEach(v=>{ if(v < lower || v > upper) outliers.push(v); });
      stats[col] = {count: vals.length, q1,q3,iqr,lower,upper,outliers};
    });
    return stats;
  }

  function quantile(sortedArr, q){
    var pos = (sortedArr.length - 1) * q;
    var base = Math.floor(pos);
    var rest = pos - base;
    if(sortedArr[base+1] !== undefined){
      return sortedArr[base] + rest * (sortedArr[base+1] - sortedArr[base]);
    } else {
      return sortedArr[base];
    }
  }

  function generateQAReport(headers, rows){
    var cleanedRows = rows.map(normalizeRowValues);
    var numericMeta = detectNumericColumns(headers, cleanedRows);
    var missing = detectMissingValues(headers, cleanedRows);
    var numericCols = headers.filter(h=> numericMeta[h].isNumeric );
    var outlierStats = detectOutliersIQR(headers, cleanedRows, numericCols);
    var summary = {
      totalRows: rows.length,
      headersCount: headers.length,
      numericColumns: numericCols,
      missingPerColumn: missing,
      numericMeta: numericMeta,
      outlierStats: outlierStats
    };
    return summary;
  }

  function filterRowsByValidity(headers, rows, options){
    // options: {requiredNumeric: [col names], removeOutliers: boolean, outlierThresholds: {col:{lower,upper}} }
    options = options || {};
    var parsed = rows.map(r=> {
      var obj = {};
      headers.forEach(h=> obj[h] = r[h]);
      return obj;
    });
    var valid = parsed.filter(r=>{
      if(options.requiredNumeric){
        for(var i=0;i<options.requiredNumeric.length;i++){
          var c = options.requiredNumeric[i];
          var n = parseNumber(r[c]);
          if(isNaN(n)) return false;
        }
      }
      if(options.outlierThresholds){
        for(var col in options.outlierThresholds){
          var thr = options.outlierThresholds[col];
          var val = parseNumber(r[col]);
          if(isNaN(val)) return false;
          if((thr.lower!==undefined && val < thr.lower) || (thr.upper!==undefined && val > thr.upper)) return false;
        }
      }
      return true;
    });
    return valid;
  }

  function exportCSV(headers, rows){
    var esc = function(v){ if(v === undefined || v === null) return '""'; return '"'+(''+v).replace(/"/g,'""')+'"'; };
    var csv = headers.map(h=> esc(h)).join(',') + '\n' + rows.map(r=> headers.map(h=> esc(r[h])).join(',')).join('\n');
    return csv;
  }

  window.DataQA = {
    parseNumber,
    detectNumericColumns,
    normalizeRowValues,
    detectMissingValues,
    detectOutliersIQR,
    generateQAReport,
    filterRowsByValidity,
    exportCSV
  };
})();
