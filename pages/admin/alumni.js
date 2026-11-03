import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import {
  archiveOfficialAlumniRecord,
  createOfficialAlumniRecord,
  exportOfficialAlumniRecords,
  getAlumniImportErrors,
  getAlumniImportHistory,
  getOfficialAlumniAudits,
  getOfficialAlumniFields,
  getOfficialAlumniRecord,
  getOfficialAlumniRecords,
  getStoredAuthToken,
  importAlumniWorkbook,
  previewAlumniImport,
  updateOfficialAlumniRecord,
} from '../../services/api';

const adminRoles = ['admin', 'manager', 'super-admin'];
const pageSizes = [10, 25, 50, 100];
const textInput = 'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-rose-700 focus:ring-2 focus:ring-rose-100';
const buttonPrimary = 'inline-flex items-center justify-center rounded-xl bg-[#4c111b] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#701e2b] disabled:cursor-not-allowed disabled:opacity-50';
const buttonSecondary = 'inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50';
const blankFilters = {
  keyword: '',
  officialName: '',
  registerNumber: '',
  courses: [],
  departments: [],
  alumniGroups: [],
  academicYearRange: '',
  joiningYearFrom: '',
  joiningYearTo: '',
  passingYearFrom: '',
  passingYearTo: '',
  accountStatus: '',
};
const emptyRecord = {
  registerNumber: '',
  officialName: '',
  course: '',
  yearOfJoining: '',
  department: '',
  alumniGroup: '',
  academicYearRange: '',
  additionalData: {},
};

const readableError = (error, fallback) => error.response?.data?.message || fallback;
const displayValue = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  if (value instanceof Date) return value.toLocaleDateString();
  return typeof value === 'object' ? JSON.stringify(value) : String(value);
};
const downloadBlob = (data, filename, contentType) => {
  const url = URL.createObjectURL(new Blob([data], { type: contentType }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};
const asFilterValue = (value) => Array.isArray(value) ? value : String(value || '').trim();

function MultiSelect({ label, options, value, onChange }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
      <select multiple value={value} onChange={(event) => onChange(Array.from(event.target.selectedOptions, (option) => option.value))} className={`${textInput} min-h-24 normal-case tracking-normal`}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      <span className="mt-1 block text-[11px] font-normal normal-case tracking-normal text-slate-400">Use Ctrl / Cmd to select more than one.</span>
    </label>
  );
}

export default function OfficialAlumniAdminPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [token, setToken] = useState('');
  const [filters, setFilters] = useState(blankFilters);
  const [activeFilters, setActiveFilters] = useState(blankFilters);
  const [dynamicFilterDraft, setDynamicFilterDraft] = useState({ field: '', value: '' });
  const [dynamicFilters, setDynamicFilters] = useState([]);
  const [activeDynamicFilters, setActiveDynamicFilters] = useState([]);
  const [available, setAvailable] = useState({ courses: [], departments: [], alumniGroups: [], dynamicFields: [] });
  const [visibleDynamicFields, setVisibleDynamicFields] = useState([]);
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [sort, setSort] = useState('recordId');
  const [direction, setDirection] = useState('asc');
  const [selectedIds, setSelectedIds] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [exporting, setExporting] = useState('');
  const [editor, setEditor] = useState(null);
  const [editorMode, setEditorMode] = useState('view');
  const [editorError, setEditorError] = useState('');
  const [saving, setSaving] = useState(false);
  const [audits, setAudits] = useState([]);
  const [file, setFile] = useState(null);
  const [importName, setImportName] = useState('');
  const [fallbackCourse, setFallbackCourse] = useState('');
  const [fallbackDepartment, setFallbackDepartment] = useState('');
  const [fallbackYear, setFallbackYear] = useState('');
  const [columnMapping, setColumnMapping] = useState({});
  const [preview, setPreview] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importHistory, setImportHistory] = useState([]);

  useEffect(() => {
    if (isLoading) return;
    if (!user || !adminRoles.includes(user.role)) {
      router.replace(user ? '/dashboard' : '/login');
      return;
    }
    const storedToken = getStoredAuthToken();
    if (!storedToken) {
      router.replace('/login');
      return;
    }
    setToken(storedToken);
  }, [isLoading, router, user]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const dynamicFilterOptions = useMemo(() => available.dynamicFields.map((field) => ({
    key: `additionalData:${field}`,
    label: field,
  })), [available.dynamicFields]);
  const tableDynamicFields = useMemo(
    () => available.dynamicFields.filter((field) => visibleDynamicFields.includes(field)),
    [available.dynamicFields, visibleDynamicFields],
  );

  const queryFilters = useMemo(() => {
    const values = [];
    for (const field of ['officialName', 'registerNumber']) {
      const value = asFilterValue(activeFilters[field]);
      if (value) values.push({ field, value });
    }
    for (const [field, selection] of [
      ['course', activeFilters.courses],
      ['department', activeFilters.departments],
      ['alumniGroup', activeFilters.alumniGroups],
    ]) {
      if (selection.length) values.push({ field, value: selection });
    }
    if (activeFilters.academicYearRange.trim()) values.push({ field: 'academicYearRange', value: activeFilters.academicYearRange.trim() });
    if (activeFilters.accountStatus) values.push({ field: 'accountStatus', value: activeFilters.accountStatus });
    for (const item of activeDynamicFilters) {
      if (item.value.trim()) values.push({ field: `additionalData:${item.field}`, value: item.value.trim() });
    }
    return values;
  }, [activeDynamicFilters, activeFilters]);

  const refreshHistory = useCallback(async (authToken) => {
    const { data } = await getAlumniImportHistory({ page: 1, limit: 6 }, authToken);
    setImportHistory(data.imports || []);
  }, []);

  const loadRecords = useCallback(async () => {
    if (!token) return;
    setIsLoadingRecords(true);
    setError('');
    try {
      const params = {
        filters: JSON.stringify(queryFilters),
        keyword: activeFilters.keyword.trim(),
        joiningYearFrom: activeFilters.joiningYearFrom,
        joiningYearTo: activeFilters.joiningYearTo,
        passingYearFrom: activeFilters.passingYearFrom,
        passingYearTo: activeFilters.passingYearTo,
        passingYearField: available.dynamicFields.find((field) => ['yearofpassing', 'passingyear', 'graduationyear', 'batchyear', 'passingoutyear', 'yearpassed'].includes(field.toLowerCase().replace(/[^a-z0-9]/g, ''))) || '',
        sort,
        direction,
        page,
        limit,
      };
      const { data } = await getOfficialAlumniRecords(params, token);
      setRecords(data.records || []);
      setTotal(data.pagination?.total || 0);
    } catch (requestError) {
      setError(readableError(requestError, 'Unable to load official alumni records.'));
    } finally {
      setIsLoadingRecords(false);
    }
  }, [activeFilters, available.dynamicFields, direction, limit, page, queryFilters, sort, token]);

  useEffect(() => {
    if (!token) return;
    getOfficialAlumniFields(token)
      .then(({ data }) => setAvailable(data))
      .catch((requestError) => setError(readableError(requestError, 'Unable to load alumni filter fields.')));
    refreshHistory(token).catch((requestError) => setError(readableError(requestError, 'Unable to load import history.')));
  }, [refreshHistory, token]);

  useEffect(() => {
    setVisibleDynamicFields((current) => current.length
      ? current.filter((field) => available.dynamicFields.includes(field))
      : available.dynamicFields.slice(0, 4));
  }, [available.dynamicFields]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const applyFilters = (event) => {
    event.preventDefault();
    setActiveFilters({ ...filters, courses: [...filters.courses], departments: [...filters.departments], alumniGroups: [...filters.alumniGroups] });
    setActiveDynamicFilters(dynamicFilters);
    setSelectedIds([]);
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(blankFilters);
    setActiveFilters(blankFilters);
    setDynamicFilters([]);
    setActiveDynamicFilters([]);
    setSelectedIds([]);
    setPage(1);
  };

  const addDynamicFilter = () => {
    if (!dynamicFilterDraft.field || !dynamicFilterDraft.value.trim()) return;
    setDynamicFilters((current) => [...current, { field: dynamicFilterDraft.field, value: dynamicFilterDraft.value.trim() }]);
    setDynamicFilterDraft({ field: '', value: '' });
  };

  const toggleSelected = (id) => {
    setSelectedIds((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  };

  const togglePageSelection = () => {
    const pageIds = records.map((record) => record._id);
    const allSelected = pageIds.length && pageIds.every((id) => selectedIds.includes(id));
    setSelectedIds((current) => allSelected
      ? current.filter((id) => !pageIds.includes(id))
      : [...new Set([...current, ...pageIds])]);
  };

  const handleExport = async (mode) => {
    setError('');
    setExporting(mode);
    try {
      const params = mode === 'all' ? { page: 1, limit: 100, sort, direction } : {
        filters: JSON.stringify(queryFilters),
        keyword: activeFilters.keyword.trim(),
        joiningYearFrom: activeFilters.joiningYearFrom,
        joiningYearTo: activeFilters.joiningYearTo,
        passingYearFrom: activeFilters.passingYearFrom,
        passingYearTo: activeFilters.passingYearTo,
        passingYearField: available.dynamicFields.find((field) => ['yearofpassing', 'passingyear', 'graduationyear', 'batchyear', 'passingoutyear', 'yearpassed'].includes(field.toLowerCase().replace(/[^a-z0-9]/g, ''))) || '',
        sort,
        direction,
      };
      if (mode === 'all') params.filters = '[]';
      if (mode === 'selected') {
        params.filters = JSON.stringify(queryFilters);
        params.keyword = activeFilters.keyword.trim();
        params.ids = JSON.stringify(selectedIds);
      }
      const { data } = await exportOfficialAlumniRecords(params, token);
      const stamp = new Date().toISOString().slice(0, 10);
      downloadBlob(data, `official-alumni-${mode}-${stamp}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    } catch (requestError) {
      setError(readableError(requestError, 'Unable to export official alumni records.'));
    } finally {
      setExporting('');
    }
  };

  const openEditor = async (record, mode) => {
    setEditorError('');
    setAudits([]);
    setEditorMode(mode);
    if (!record) {
      setEditor({ ...emptyRecord });
      return;
    }
    setEditor({ ...record, additionalData: record.additionalData || {} });
    if (mode === 'view') {
      try {
        const [{ data: details }, { data: auditData }] = await Promise.all([
          getOfficialAlumniRecord(record._id, token),
          getOfficialAlumniAudits(record._id, { page: 1, limit: 20 }, token),
        ]);
        setEditor(details.record);
        setAudits(auditData.audits || []);
      } catch (requestError) {
        setEditorError(readableError(requestError, 'Unable to load this record.'));
      }
    }
  };

  const saveRecord = async (event) => {
    event.preventDefault();
    if (!editor) return;
    setSaving(true);
    setEditorError('');
    try {
      let additionalData = editor.additionalData;
      if (typeof additionalData === 'string') {
        additionalData = JSON.parse(additionalData || '{}');
      }
      if (!additionalData || Array.isArray(additionalData) || typeof additionalData !== 'object') {
        throw new Error('Additional fields must be a JSON object.');
      }
      const payload = {
        registerNumber: editor.registerNumber,
        officialName: editor.officialName,
        course: editor.course,
        yearOfJoining: Number(editor.yearOfJoining),
        department: editor.department || '',
        alumniGroup: editor.alumniGroup || '',
        academicYearRange: editor.academicYearRange || '',
        additionalData,
      };
      if (editor._id) await updateOfficialAlumniRecord(editor._id, payload, token);
      else await createOfficialAlumniRecord(payload, token);
      setEditor(null);
      setNotice(editor._id ? 'Alumni record updated.' : 'Alumni record added.');
      await loadRecords();
      await refreshHistory(token);
      getOfficialAlumniFields(token).then(({ data }) => setAvailable(data));
    } catch (requestError) {
      setEditorError(readableError(requestError, requestError.message || 'Unable to save this record.'));
    } finally {
      setSaving(false);
    }
  };

  const archiveRecord = async (record) => {
    if (!window.confirm(`Archive ${record.officialName}? The record will remain in the audit history.`)) return;
    setError('');
    try {
      await archiveOfficialAlumniRecord(record._id, token);
      setSelectedIds((current) => current.filter((id) => id !== record._id));
      setNotice('Record archived. Historical data is preserved.');
      await loadRecords();
    } catch (requestError) {
      setError(readableError(requestError, 'Unable to archive this record.'));
    }
  };

  const buildImportForm = () => {
    const body = new FormData();
    body.append('file', file);
    body.append('importName', importName || file.name);
    body.append('course', fallbackCourse);
    body.append('department', fallbackDepartment);
    body.append('yearOfJoining', fallbackYear);
    body.append('columnMapping', JSON.stringify(columnMapping));
    return body;
  };

  const previewImport = async (event) => {
    event.preventDefault();
    if (!file) return;
    setIsPreviewing(true);
    setError('');
    setNotice('');
    setImportResult(null);
    try {
      const { data } = await previewAlumniImport(buildImportForm(), token);
      setPreview(data);
      setColumnMapping(data.mapping || {});
    } catch (requestError) {
      setPreview(null);
      setError(readableError(requestError, 'Unable to preview this file.'));
    } finally {
      setIsPreviewing(false);
    }
  };

  const submitImport = async () => {
    if (!file || !preview || preview.needsMapping || !preview.summary?.valid) return;
    setIsImporting(true);
    setError('');
    try {
      const { data } = await importAlumniWorkbook(buildImportForm(), token);
      setImportResult(data);
      setNotice('Import completed. Existing records were preserved; new records were appended.');
      await Promise.all([loadRecords(), refreshHistory(token)]);
      getOfficialAlumniFields(token).then(({ data: fieldData }) => setAvailable(fieldData));
    } catch (requestError) {
      setError(readableError(requestError, 'Unable to import this file.'));
    } finally {
      setIsImporting(false);
    }
  };

  const downloadImportErrorReport = async (id) => {
    try {
      const { data } = await getAlumniImportErrors(id, token);
      downloadBlob(data, `official-alumni-import-errors-${id}.csv`, 'text/csv;charset=utf-8');
    } catch (requestError) {
      setError(readableError(requestError, 'Unable to download the import error report.'));
    }
  };

  if (isLoading || !user || !adminRoles.includes(user.role) || !token) {
    return <main className="flex min-h-[55vh] items-center justify-center bg-slate-50 text-slate-600" aria-busy="true">Loading Official Alumni Management…</main>;
  }

  return (
    <main className="min-h-screen bg-[#f4f6fa] px-3 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#35101a] via-[#551a2a] to-[#8c3d36] p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-rose-200">Admin workspace / Official Alumni</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Alumni Management</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-rose-100">A secure, searchable register for official alumni records, bulk imports, and Excel exports.</p>
            </div>
            <button type="button" onClick={() => openEditor(null, 'edit')} className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#4c111b] shadow-sm transition hover:bg-rose-50">+ Add alumni record</button>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-100">Matching records</p>
              <p className="mt-1 text-2xl font-black">{total.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-100">Available courses</p>
              <p className="mt-1 text-2xl font-black">{available.courses.length}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-100">Dynamic fields</p>
              <p className="mt-1 text-2xl font-black">{available.dynamicFields.length}</p>
            </div>
          </div>
        </header>

        {error && <div role="alert" className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"><span>{error}</span><button type="button" onClick={() => setError('')} aria-label="Dismiss error">×</button></div>}
        {notice && <div role="status" className="flex items-start justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><span>{notice}</span><button type="button" onClick={() => setNotice('')} aria-label="Dismiss message">×</button></div>}

        <section id="alumni-bulk-import" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-800">Excel / CSV</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">Import alumni data</h2>
              <p className="mt-1 text-sm text-slate-500">Preview columns and duplicates before appending up to 50,000 rows. Existing records are never replaced.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">.xlsx · .xls · .csv · max 10 MB</span>
          </div>
          <form id="alumni-workbook-import" onSubmit={previewImport} className="mt-5 grid gap-4 lg:grid-cols-12">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 lg:col-span-4">
              Select file
              <input type="file" accept=".xlsx,.xls,.csv" required onChange={(event) => { setFile(event.target.files?.[0] || null); setPreview(null); setImportResult(null); setColumnMapping({}); }} className={`${textInput} file:mr-3 file:rounded-lg file:border-0 file:bg-rose-50 file:px-3 file:py-2 file:text-xs file:font-bold file:text-rose-900`} />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 lg:col-span-2">
              Import name
              <input value={importName} onChange={(event) => setImportName(event.target.value)} placeholder={file?.name || 'Optional'} className={`${textInput} normal-case tracking-normal`} />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 lg:col-span-2">
              Default course
              <input value={fallbackCourse} onChange={(event) => setFallbackCourse(event.target.value)} placeholder="Used if absent in file" className={`${textInput} normal-case tracking-normal`} />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 lg:col-span-2">
              Default department
              <input value={fallbackDepartment} onChange={(event) => setFallbackDepartment(event.target.value)} placeholder="Optional" className={`${textInput} normal-case tracking-normal`} />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 lg:col-span-2">
              Default joining year
              <input type="number" min="1989" max="2100" value={fallbackYear} onChange={(event) => setFallbackYear(event.target.value)} placeholder="Used if absent" className={`${textInput} normal-case tracking-normal`} />
            </label>
            <div className="flex flex-wrap items-center gap-2 lg:col-span-12">
              <button type="submit" disabled={!file || isPreviewing || isImporting} className={buttonPrimary}>{isPreviewing ? 'Checking file…' : 'Preview import'}</button>
              {preview && !preview.needsMapping && (
                <button type="button" onClick={submitImport} disabled={!preview.summary?.valid || isImporting || isPreviewing} className={buttonSecondary}>
                  {isImporting ? 'Importing records…' : `Import ${preview.summary?.valid || 0} valid records`}
                </button>
              )}
            </div>
          </form>

          {preview && (
            <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <h3 className="font-bold text-slate-900">Import preview</h3>
                  <p className="mt-1 text-xs text-slate-500">Detected columns: {preview.headersDetected?.join(', ') || 'No columns detected'}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    ['Rows', preview.summary?.processed],
                    ['Ready', preview.summary?.valid],
                    ['Duplicates', preview.summary?.duplicates],
                    ['Invalid / skipped', preview.summary?.rejected + preview.summary?.skipped],
                  ].map(([label, count]) => <span key={label} className="rounded-lg bg-white px-3 py-2 font-semibold text-slate-700 shadow-sm">{label}: {count ?? 0}</span>)}
                </div>
              </div>
              {(preview.needsMapping || preview.summary?.valid === 0) && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    ['registerNumber', 'Registration number'],
                    ['officialName', 'Official name'],
                    ['course', 'Course'],
                    ['yearOfJoining', 'Year of joining'],
                  ].map(([key, label]) => (
                    <label key={key} className="text-xs font-semibold text-slate-600">{label}
                      <select value={columnMapping[key] || ''} onChange={(event) => setColumnMapping((current) => ({ ...current, [key]: event.target.value }))} className={`${textInput} font-normal`}>
                        <option value="">Select column (or use default)</option>
                        {preview.headersDetected?.map((header) => <option key={`${key}-${header}`} value={header}>{header}</option>)}
                      </select>
                    </label>
                  ))}
                  <p className="text-xs leading-5 text-slate-500 sm:col-span-2 lg:col-span-4">Map required columns if automatic detection did not match. Course and joining year can also use the default values above.</p>
                  <button type="button" onClick={previewImport} disabled={!file || isPreviewing} className={`${buttonSecondary} sm:col-span-2 lg:col-span-4`}>{isPreviewing ? 'Rechecking…' : 'Recheck with these mappings'}</button>
                </div>
              )}
              {preview.rows?.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="min-w-full text-left text-xs">
                    <thead className="bg-slate-100 text-[10px] uppercase tracking-wide text-slate-500"><tr>{['Row', 'Registration', 'Name', 'Course', 'Joining year', 'Status / errors'].map((heading) => <th key={heading} className="whitespace-nowrap px-3 py-2.5">{heading}</th>)}</tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {preview.rows.map((row) => <tr key={row.rowNumber}>
                        <td className="px-3 py-2">{row.rowNumber}</td>
                        <td className="px-3 py-2 font-medium text-slate-800">{row.registerNumber || '—'}</td>
                        <td className="px-3 py-2">{row.officialName || '—'}</td>
                        <td className="px-3 py-2">{row.course || '—'}</td>
                        <td className="px-3 py-2">{row.yearOfJoining || '—'}</td>
                        <td className={`min-w-52 px-3 py-2 ${row.errors?.length ? 'text-rose-700' : 'text-emerald-700'}`}>{row.errors?.join(' ') || 'Ready'}</td>
                      </tr>)}
                    </tbody>
                  </table>
                  {preview.summary?.processed > preview.rows.length && <p className="border-t border-slate-100 px-3 py-2 text-xs text-slate-500">Showing the first {preview.rows.length} rows; all {preview.summary.processed.toLocaleString()} rows were validated.</p>}
                </div>
              )}
              {preview.needsMapping && preview.sampleRecords?.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="min-w-full text-left text-xs">
                    <thead className="bg-slate-100 text-[10px] uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-2.5">Row</th>{preview.headersDetected.map((header) => <th key={header} className="whitespace-nowrap px-3 py-2.5">{header}</th>)}</tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {preview.sampleRecords.map((record) => <tr key={record.rowNumber}>
                        <td className="px-3 py-2">{record.rowNumber}</td>
                        {preview.headersDetected.map((header) => <td key={`${record.rowNumber}-${header}`} className="max-w-56 truncate px-3 py-2" title={displayValue(record.values?.[header])}>{displayValue(record.values?.[header])}</td>)}
                      </tr>)}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {importResult && (
            <div role="status" className="mt-4 flex flex-col justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center">
              <p className="text-sm font-semibold text-emerald-900">Import report: {importResult.summary?.inserted || 0} added · {importResult.summary?.skipped || 0} skipped · {importResult.summary?.rejected || 0} failed</p>
              <button type="button" onClick={() => downloadImportErrorReport(importResult.importId)} className="text-left text-sm font-bold text-emerald-900 underline">Download error report</button>
            </div>
          )}
        </section>

        <section id="advanced-filters" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-800">Find records</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">Advanced filters</h2>
            </div>
            <span className="text-xs text-slate-500">Filters combine with AND. Dynamic columns are available as soon as they are imported.</span>
          </div>
          <form onSubmit={applyFilters} className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 sm:col-span-2">
              Keyword search
              <input value={filters.keyword} onChange={(event) => setFilters({ ...filters, keyword: event.target.value })} placeholder="Search any official or imported field" className={`${textInput} normal-case tracking-normal`} />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Student name
              <input value={filters.officialName} onChange={(event) => setFilters({ ...filters, officialName: event.target.value })} className={`${textInput} normal-case tracking-normal`} />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Registration number
              <input value={filters.registerNumber} onChange={(event) => setFilters({ ...filters, registerNumber: event.target.value })} className={`${textInput} normal-case tracking-normal`} />
            </label>
            <MultiSelect label="Course" options={available.courses} value={filters.courses} onChange={(value) => setFilters({ ...filters, courses: value })} />
            <MultiSelect label="Department / branch" options={available.departments} value={filters.departments} onChange={(value) => setFilters({ ...filters, departments: value })} />
            <MultiSelect label="Alumni group / batch" options={available.alumniGroups} value={filters.alumniGroups} onChange={(value) => setFilters({ ...filters, alumniGroups: value })} />
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Academic year / batch
              <input value={filters.academicYearRange} onChange={(event) => setFilters({ ...filters, academicYearRange: event.target.value })} placeholder="e.g. 2018–2022" className={`${textInput} normal-case tracking-normal`} />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Account status
              <select value={filters.accountStatus} onChange={(event) => setFilters({ ...filters, accountStatus: event.target.value })} className={`${textInput} normal-case tracking-normal`}>
                <option value="">All statuses</option><option value="linked">Account linked</option><option value="unlinked">No account linked</option>
              </select>
            </label>
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Joining year range</p>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                <input type="number" min="1989" max="2100" aria-label="Joining year from" placeholder="From" value={filters.joiningYearFrom} onChange={(event) => setFilters({ ...filters, joiningYearFrom: event.target.value })} className={textInput} />
                <input type="number" min="1989" max="2100" aria-label="Joining year to" placeholder="To" value={filters.joiningYearTo} onChange={(event) => setFilters({ ...filters, joiningYearTo: event.target.value })} className={textInput} />
              </div>
            </div>
            {available.dynamicFields.some((field) => ['yearofpassing', 'passingyear', 'graduationyear', 'batchyear', 'passingoutyear', 'yearpassed'].includes(field.toLowerCase().replace(/[^a-z0-9]/g, ''))) && (
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Passing / graduation year range</p>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  <input type="number" min="1950" max="2100" aria-label="Passing year from" placeholder="From" value={filters.passingYearFrom} onChange={(event) => setFilters({ ...filters, passingYearFrom: event.target.value })} className={textInput} />
                  <input type="number" min="1950" max="2100" aria-label="Passing year to" placeholder="To" value={filters.passingYearTo} onChange={(event) => setFilters({ ...filters, passingYearTo: event.target.value })} className={textInput} />
                </div>
              </div>
            )}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 sm:col-span-2 lg:col-span-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Additional imported field</p>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <select value={dynamicFilterDraft.field} onChange={(event) => setDynamicFilterDraft({ ...dynamicFilterDraft, field: event.target.value })} className={`${textInput} mt-0 sm:max-w-xs`}>
                  <option value="">Choose a field</option>
                  {dynamicFilterOptions.map((option) => <option key={option.key} value={option.label}>{option.label}</option>)}
                </select>
                <input value={dynamicFilterDraft.value} onChange={(event) => setDynamicFilterDraft({ ...dynamicFilterDraft, value: event.target.value })} placeholder="Contains…" className={`${textInput} mt-0 sm:max-w-sm`} />
                <button type="button" onClick={addDynamicFilter} className={buttonSecondary}>Add filter</button>
              </div>
              {dynamicFilters.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{dynamicFilters.map((item, index) => <span key={`${item.field}-${index}`} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs text-slate-700 ring-1 ring-slate-200">{item.field}: {item.value}<button type="button" aria-label={`Remove ${item.field} filter`} onClick={() => setDynamicFilters((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="font-bold text-slate-500">×</button></span>)}</div>}
            </div>
            <div className="flex flex-wrap items-end gap-2 sm:col-span-2 lg:col-span-4">
              <button type="submit" className={buttonPrimary}>Apply filters</button>
              <button type="button" onClick={clearFilters} className={buttonSecondary}>Clear all</button>
            </div>
          </form>
        </section>

        <section id="alumni-records" className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-6">
            <div>
              <h2 className="font-bold text-slate-900">Official alumni records</h2>
              <p className="mt-1 text-sm text-slate-500">{isLoadingRecords ? 'Updating results…' : `${total.toLocaleString()} matching records`}{selectedIds.length ? ` · ${selectedIds.length} selected` : ''}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => handleExport('all')} disabled={Boolean(exporting)} className={buttonSecondary}>{exporting === 'all' ? 'Exporting…' : 'Export all'}</button>
              <button type="button" onClick={() => handleExport('filtered')} disabled={Boolean(exporting)} className={buttonSecondary}>{exporting === 'filtered' ? 'Exporting…' : 'Export filtered'}</button>
              <button type="button" onClick={() => handleExport('selected')} disabled={!selectedIds.length || Boolean(exporting)} className={buttonPrimary}>{exporting === 'selected' ? 'Exporting…' : `Export selected (${selectedIds.length})`}</button>
            </div>
          </div>
          <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-end gap-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                Sort by
                <select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }} className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs">
                  {[
                    ['recordId', 'Internal record ID'],
                    ['officialName', 'Student name'],
                    ['registerNumber', 'Registration number'],
                    ['course', 'Course'],
                    ['department', 'Department'],
                    ['yearOfJoining', 'Joining year'],
                    ...dynamicFilterOptions.map((field) => [`additionalData:${field.label}`, field.label]),
                  ].map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <select value={direction} onChange={(event) => { setDirection(event.target.value); setPage(1); }} className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs" aria-label="Sort direction">
                  <option value="asc">Ascending</option><option value="desc">Descending</option>
                </select>
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">Rows per page
                <select value={limit} onChange={(event) => { setLimit(Number(event.target.value)); setPage(1); }} className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs">
                  {pageSizes.map((size) => <option key={size} value={size}>{size}</option>)}
                </select>
              </label>
            </div>
            {available.dynamicFields.length > 0 && (
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                Show extra columns
                <select multiple value={visibleDynamicFields} onChange={(event) => setVisibleDynamicFields(Array.from(event.target.selectedOptions, (option) => option.value))} className="h-10 max-w-64 rounded-lg border border-slate-200 bg-white px-2 text-xs" aria-label="Choose additional table columns">
                  {available.dynamicFields.map((field) => <option key={field} value={field}>{field}</option>)}
                </select>
              </label>
            )}
          </div>
          {isLoadingRecords ? <div className="p-16 text-center text-sm text-slate-500" aria-busy="true">Loading records…</div> : records.length === 0 ? (
            <div className="p-16 text-center"><p className="font-semibold text-slate-800">No matching records</p><p className="mt-1 text-sm text-slate-500">Try clearing filters or import an alumni spreadsheet.</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                <thead className="bg-white text-[10px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="w-10 px-4 py-3"><input type="checkbox" aria-label="Select records on this page" checked={records.length > 0 && records.every((record) => selectedIds.includes(record._id))} onChange={togglePageSelection} /></th>
                    {['ID', 'Registration no.', 'Student name', 'Course / department', 'Joined', 'Batch / group', 'Account', 'Actions'].map((heading) => <th key={heading} className="whitespace-nowrap px-4 py-3 font-bold">{heading}</th>)}
                    {tableDynamicFields.map((field) => <th key={field} className="whitespace-nowrap px-4 py-3 font-bold">{field}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map((record) => (
                    <tr key={record._id} className="align-top text-slate-600 hover:bg-rose-50/30">
                      <td className="px-4 py-4"><input type="checkbox" aria-label={`Select ${record.officialName}`} checked={selectedIds.includes(record._id)} onChange={() => toggleSelected(record._id)} /></td>
                      <td className="whitespace-nowrap px-4 py-4 font-mono text-xs font-semibold text-slate-500">{record.recordId ?? '—'}</td>
                      <td className="whitespace-nowrap px-4 py-4 font-mono text-xs">{record.registerNumber}</td>
                      <td className="px-4 py-4"><p className="font-semibold text-slate-900">{record.officialName}</p><p className="mt-1 text-xs text-slate-500">{record.academicYearRange || 'Batch not specified'}</p></td>
                      <td className="px-4 py-4">{record.course}<span className="block text-xs text-slate-500">{record.department || 'Department not specified'}</span></td>
                      <td className="px-4 py-4">{record.yearOfJoining}</td>
                      <td className="px-4 py-4">{record.alumniGroup || '—'}</td>
                      <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${record.linkedUserId ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{record.linkedUserId ? 'Linked' : 'Unlinked'}</span></td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <button type="button" onClick={() => openEditor(record, 'view')} className="mr-3 font-semibold text-slate-700 hover:text-rose-800">View</button>
                        <button type="button" onClick={() => openEditor(record, 'edit')} className="mr-3 font-semibold text-rose-800 hover:text-rose-950">Edit</button>
                        <button type="button" onClick={() => archiveRecord(record)} className="font-semibold text-red-700 hover:text-red-900">Archive</button>
                      </td>
                      {tableDynamicFields.map((field) => <td key={field} className="max-w-56 truncate px-4 py-4" title={displayValue(record.additionalData?.[field])}>{displayValue(record.additionalData?.[field])}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <footer className="flex flex-col justify-between gap-3 border-t border-slate-100 px-5 py-4 text-sm sm:flex-row sm:items-center">
            <span className="text-slate-500">Page {page} of {totalPages} · {total.toLocaleString()} records</span>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1 || isLoadingRecords} onClick={() => setPage((current) => current - 1)} className={buttonSecondary}>Previous</button>
              <button type="button" disabled={page >= totalPages || isLoadingRecords} onClick={() => setPage((current) => current + 1)} className={buttonSecondary}>Next</button>
            </div>
          </footer>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-end justify-between gap-3 border-b border-slate-100 p-5 sm:px-6">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-800">Audit trail</p><h2 className="mt-1 text-lg font-bold text-slate-900">Recent imports</h2></div>
            <span className="text-xs text-slate-500">File, admin, date, and processing totals</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500"><tr>{['File', 'Imported by', 'Uploaded', 'Processed', 'Added', 'Skipped', 'Failed', 'Report'].map((heading) => <th key={heading} className="whitespace-nowrap px-4 py-3 font-bold">{heading}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-100">
                {importHistory.map((item) => <tr key={item._id}>
                  <td className="max-w-64 truncate px-4 py-3 font-semibold text-slate-800" title={item.originalFileName}>{item.originalFileName}</td>
                  <td className="px-4 py-3">{item.createdBy?.name || item.createdBy?.email || 'Admin'}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}</td>
                  <td className="px-4 py-3">{item.summary?.processed || 0}</td>
                  <td className="px-4 py-3 text-emerald-700">{item.summary?.inserted || 0}</td>
                  <td className="px-4 py-3">{item.summary?.skipped || 0}</td>
                  <td className="px-4 py-3 text-rose-700">{item.summary?.rejected || 0}</td>
                  <td className="px-4 py-3"><button type="button" onClick={() => downloadImportErrorReport(item._id)} className="font-semibold text-rose-800 underline">CSV</button></td>
                </tr>)}
                {!importHistory.length && <tr><td colSpan="8" className="px-4 py-8 text-center text-sm text-slate-500">No imports yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {editor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditor(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="official-alumni-editor-title" className="my-auto max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-800">{editorMode === 'view' ? 'Record details' : editor._id ? 'Edit official record' : 'New official record'}</p><h2 id="official-alumni-editor-title" className="mt-1 text-2xl font-black text-slate-900">{editorMode === 'view' ? editor.officialName : editor._id ? 'Update alumni record' : 'Add alumni record'}</h2></div>
              <button type="button" onClick={() => setEditor(null)} aria-label="Close dialog" className="rounded-xl p-2 text-2xl leading-none text-slate-400 hover:bg-slate-100">×</button>
            </div>
            {editorError && <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{editorError}</p>}
            {editorMode === 'view' ? (
              <div className="mt-6 space-y-6">
                <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    ['Internal record ID', editor.recordId],
                    ['Registration number', editor.registerNumber],
                    ['Official name', editor.officialName],
                    ['Course', editor.course],
                    ['Department', editor.department],
                    ['Year of joining', editor.yearOfJoining],
                    ['Alumni group', editor.alumniGroup],
                    ['Academic year / batch', editor.academicYearRange],
                    ['Account status', editor.linkedUserId ? 'Linked' : 'Unlinked'],
                    ...Object.entries(editor.additionalData || {}).map(([key, value]) => [key, typeof value === 'object' ? JSON.stringify(value) : value]),
                  ].map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-3"><dt className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 break-words text-sm font-semibold text-slate-800">{value ?? '—'}</dd></div>)}
                </dl>
                <div><h3 className="font-bold text-slate-900">Change history</h3><div className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-100">
                  {audits.map((audit) => <div key={audit._id} className="flex flex-col justify-between gap-1 px-4 py-3 text-xs sm:flex-row"><span className="font-semibold capitalize text-slate-800">{audit.action}</span><span className="text-slate-500">{audit.administratorId?.name || audit.administratorId?.email || 'Administrator'} · {new Date(audit.createdAt).toLocaleString()}</span></div>)}
                  {!audits.length && <p className="px-4 py-4 text-sm text-slate-500">No changes recorded.</p>}
                </div></div>
                <button type="button" onClick={() => { setEditorMode('edit'); setAudits([]); }} className={buttonPrimary}>Edit record</button>
              </div>
            ) : (
              <form onSubmit={saveRecord} className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ['registerNumber', 'Registration number', true],
                  ['officialName', 'Official name', true],
                  ['course', 'Course', true],
                  ['department', 'Department / branch', false],
                  ['yearOfJoining', 'Year of joining', true],
                  ['alumniGroup', 'Alumni group / batch', false],
                  ['academicYearRange', 'Academic year range', false],
                ].map(([field, label, required]) => <label key={field} className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}
                  <input required={required} type={field === 'yearOfJoining' ? 'number' : 'text'} min={field === 'yearOfJoining' ? '1989' : undefined} max={field === 'yearOfJoining' ? '2100' : undefined} value={editor[field] ?? ''} onChange={(event) => setEditor({ ...editor, [field]: event.target.value })} className={`${textInput} normal-case tracking-normal`} />
                </label>)}
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 sm:col-span-2">Additional imported fields (JSON)
                  <textarea rows={7} value={typeof editor.additionalData === 'string' ? editor.additionalData : JSON.stringify(editor.additionalData || {}, null, 2)} onChange={(event) => setEditor({ ...editor, additionalData: event.target.value })} className={`${textInput} font-mono text-xs normal-case tracking-normal`} />
                  <span className="mt-1 block text-[11px] font-normal normal-case tracking-normal text-slate-400">Keep column names as keys; values may be text, numbers, or booleans.</span>
                </label>
                <div className="flex gap-2 sm:col-span-2">
                  <button type="submit" disabled={saving} className={buttonPrimary}>{saving ? 'Saving…' : 'Save record'}</button>
                  <button type="button" onClick={() => setEditor(null)} className={buttonSecondary}>Cancel</button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
