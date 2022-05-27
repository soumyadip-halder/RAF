import {
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  makeStyles,
  OutlinedInput,
  Radio,
  RadioGroup,
  Typography,
  InputAdornment,
  Button,
  Dialog,
  Box,
  useTheme,
  useMediaQuery,
  styled,
  TextField,
  Select,
  InputLabel,
  MenuItem,
} from '@material-ui/core'
import { teal } from '@material-ui/core/colors'
import { SearchOutlined } from '@material-ui/icons'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
// import { RiFileExcel2Fill } from 'react-icons/ri'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers'
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import DatePicker from '@mui/lab/DatePicker';
import DateFnsUtils from '@date-io/date-fns'
import React, { useState, useEffect } from 'react'
import { tableBodyStyle, tableHeaderStyle, useStyles } from './styles'
import { useLocation } from 'react-router-dom'
import {
  // actionTypes,
  delistAddedToRangeCols,
  delistExistingProductsCols,
  massActions,
  productListCols,
  salesChannels,
  delistToRangeData,
  placeholderCols,
  lineStatusOptions,
  actionTypeConstants,
  // supplierCodes
} from './DataConstants'
// import TextFieldWithSearch from './sections/TextFieldWithSearch/TextFieldWithSearch'
import { MultiSelect } from 'primereact/multiselect'
import { Dropdown } from 'primereact/dropdown'
import AutocompleteSelect from '../../components/AutoCompleteSelect/AutocompleteSelect'
import DialogHeader from '../../components/DialogHeader/DialogHeader'
import {
  getEventDetailsById,
  getActionTypes,
  getRangeResetPerEvent,
} from '../../../api/Fetch'
import { manageEventPublishCols } from './DataConstants'

// const useStyles = makeStyles((theme: any) => {
//   return {
//     backButton: {
//       border: 0,
//       color: 'blue',
//       backgroundColor: 'white',
//       cursor: 'pointer',
//       fontSize: '18px',
//     },
//     uploadTextfield: {
//       [theme.breakpoints.up('sm')]: {
//         width: 200,
//       },
//       [theme.breakpoints.down('sm')]: {
//         width: 100,
//       },

//       height: '32px',
//       cursor: 'pointer',
//     },
//     uploadButton: {
//       width: 100,
//       height: '32px',
//       cursor: 'pointer',
//       backgroundColor: teal[900],
//       color: 'white',
//     },
//     dialogTitle: {
//       backgroundColor: theme.palette.primary.main,
//       color: 'white',
//       alignItems: 'baseline',
//     },
//     dialogCloseButton: {
//       color: '#ff5252',
//       backgroundColor: theme.palette.primary.main,
//       fontSize: '18px',
//       '&:hover': {
//         color: '#d50000',
//         backgroundColor: '#00e676',
//         cursor: 'pointer',
//         borderRadius: 10,
//       },
//     },
//     submitButtons: {
//       width: 'auto',
//       backgroundColor: teal[900],
//       color: 'white',
//       height: 40,
//       '&:hover': {
//         backgroundColor: teal[600],
//         color: 'white',
//       },
//     },
//     placeholderCountStyle: {
//       borderTop: 'none',
//       borderLeft: 'none',
//       borderRight: 'none',
//       fontSize: '1rem',
//       padding: '10px',
//       marginTop: '5px',
//     },
//     placeholderSelect: {
//       width: '100%',
//       fontSize: '1rem',
//       padding: '5px',
//       marginTop: '5px',
//     },
//     addActionFields: {
//       height: '40px',
//       width: '100%',
//     },
//   }
// })

function DelistsAddedToRange() {
  const location: any = useLocation()
  const classes = useStyles()
  const theme = useTheme()
  const small = useMediaQuery(theme.breakpoints.up('md'))
  const radio = <Radio color="primary" />

  const [productType, setProductType] = useState<any>('existingProducts')
  const [isProgressLoader, setIsProgressLoader] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [eventDetails, setEventDetails] = useState<any>([])
  const [actionTypes, setActionTypes] = useState<any>([])
  // const [eventDetails, setEventDetails] = useState<any>(delistToRangeData)
  // const [eventDetails, setEventDetails] = useState<any>([])
  const [actionType, setActionType] = useState<any>()
  const [min, setMin] = useState<any>('')
  const [existingSearchFields, setExistingSearchFields] = useState<any>()
  const [productId, setProductId] = useState<any>('')
  const [noOfStores, setNoOfStores] = useState<any>('')
  const [storeCode, setStoreCode] = useState<any>('')
  const [supplier, setSupplier] = useState<any>('')
  const [supplierSiteNumber, setSupplierSiteNumber] = useState<any>('')
  const [local, setLocal] = useState<any>('yes')
  const [pin, setPin] = useState<any>('')
  const [buyingMinIngredients, setBuyingMinIngredients] = useState<any>('')
  const [openUploadDialog, setOpenUploadDialog] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<any>()
  const [importedData, setImportedData] = useState<any>()
  const [supplierCode, setSupplierCode] = useState<any>()
  const [selectedSalesChannels, setSelectedSalesChannels] = useState<any>()
  const [placeholderCount, setPlaceholderCount] = useState<any>('')
  const [placeholderProducts, setPlaceholderProducts] = useState<any>([])
  const [newProductId, setNewProductId] = useState<any>('')
  const [selectedProductListItems, setSelectedProductListItems] =
    useState<any>()
  const [bulkActions, setBulkActions] = useState<any>()
  const [openActionTypeDialog, setOpenActionTypeDialog] = useState(false)

  const [replaceMinOrPin, setReplaceMinOrPin] = useState<any>('')
  const [fromDate, setFromDate] = useState<any>()
  const [toDate, setToDate] = useState<any>()
  const [addStoreCode, setAddStoreCode] = useState<any>('')
  const [comments, setComments] = useState<any>('')
  const [openPlaceholderDialog, setOpenPlaceholderDialog] = useState(false)
  const [openPlaceholderUpload, setOpenPlaceholderUpload] = useState(false)
  const [placeholderFile, setPlaceholderFile] = useState<any>()

  const [selectedPlaceholderData, setSelectedPlaceholderData] = useState<any>(
    []
  )

  // useEffect(() => {
  //   console.log(location.state.data)
  //   setEventDetails([location.state.data])
  // }, [location])

  // useEffect(() => {
  //   console.log(eventDetails)
  // }, [eventDetails])

  useEffect(() => {
    setExistingSearchFields([
      {
        productId: productId,
        storeCode: storeCode,
        supplier: supplier,
        supplierSiteNumber: supplierSiteNumber,
        local: local,
        pin: pin,
        buyingMinIngredients: buyingMinIngredients,
      },
    ])
  }, [
    productId,
    storeCode,
    supplier,
    supplierSiteNumber,
    local,
    pin,
    buyingMinIngredients,
  ])

  const Input = styled('input')({
    display: 'none',
  })

  const getEventAndTasks = (eventId: any) => {
    getEventDetailsById(eventId)
      .then((res: any) => {
        let data = res.data
        const eventData = data.eventDetailsList[0].rangeEventRequest
        console.log('EVENTID', eventData)
        // const milestoneData = data.eventDetailsList[0].milestones

        // Below original API CALL

        // const eventData = res.data.eventDetailsList[0].rangeEventRequest
        // const milestoneData = res.data.eventDetailsList[0].milestones
        // console.log('EVENTID', eventData)

        const manageList = [
          {
            eventStatus: eventData.eventStatus,
            resetType: eventData.eventHeader.resetType,
            category: eventData.eventHeader.eventHierarchy.category,
            department: eventData.eventHeader.eventHierarchy.department,
            tradeGroup: eventData.eventHeader.eventHierarchy.tradingGroup,
            eventId: eventData.eventId,
            taskIdEvent: eventData.taskId,
            targetDate: eventData.eventHeader.eventLaunchDate,
            appDueDate: eventData.eventHeader.rafAppDueDate,
            eventName: eventData.eventHeader.eventName,
            planogramClass:
              eventData.eventHeader.inventoryControl.planogramClass,
            clearancePriceCheck:
              eventData.eventHeader.inventoryControl.clearancePriceApplied,
            orderStopDateCheck:
              eventData.eventHeader.inventoryControl.orderStopDateCheckRequired,
            stopOrder:
              eventData.eventHeader.inventoryControl.stopOrderStockRundown,
            wastageRange:
              eventData.eventHeader.inventoryControl.storeWastetiming,
            buyerEmailId: {
              persona: '',
              emailId: '',
              name: '',
              userId: '',
              roleId: 'BUYER',
            },
            buyerAssistantEmailId: {
              persona: '',
              emailId: '',
              name: '',
              userId: '',
              roleId: 'BYAST',
            },
            ownBrandManagerEmailId: {
              persona: '',
              emailId: '',
              name: '',
              userId: '',
              roleId: 'OWNBRM',
            },
            seniorBuyingManagerEmailId: {
              persona: '',
              emailId: '',
              name: '',
              userId: '',
              roleId: 'SRBYM',
            },
            merchandiserEmailId: {
              persona: '',
              emailId: '',
              name: '',
              userId: '',
              roleId: 'MERCH',
            },
            rangeResetManagerEmailId: {
              persona: '',
              emailId: '',
              name: '',
              userId: '',
              roleId: 'RRMNGR',
            },
            categoryDirectorEmailId: {
              persona: '',
              emailId: '',
              name: '',
              userId: '',
              roleId: 'CTDIR',
            },
            supplyChainAnalystEmailId: {
              persona: '',
              emailId: '',
              name: '',
              userId: '',
              roleId: 'SCSPL',
            },
            requesterEmailId: eventData.requester.details.emailId,
            requesterName: eventData.requester.details.name,
            requesteruserId: eventData.requester.details.userId,
            requesterRole: eventData.requester.roles,
            requesterUserGroup: eventData.requester.usergroups,
            requesterPersona: eventData.requester.persona,
          },
        ]

        eventData.eventHeader.eventTeam.team.map((val: any) => {
          // if (val.roles[0].roleId === 'Buyer') {
          //   manageList[0].buyerEmailId = val.details.emailId
          // }
          // if (val.roles[0].roleId === 'Buying Assistant') {
          //   manageList[0].buyerAssistantEmailId = val.details.emailId
          // }
          if (val.persona === 'Buyer') {
            manageList[0].buyerEmailId.persona = val.persona
            manageList[0].buyerEmailId.emailId = val.details.emailId
            manageList[0].buyerEmailId.name = val.details.name
            manageList[0].buyerEmailId.userId = val.details.userId
          }
          if (val.persona === 'Buying Assistant') {
            manageList[0].buyerAssistantEmailId.persona = val.persona
            manageList[0].buyerAssistantEmailId.emailId = val.details.emailId
            manageList[0].buyerAssistantEmailId.name = val.details.name
            manageList[0].buyerAssistantEmailId.userId = val.details.userId
          }
          if (val.persona === 'Range Reset Manager') {
            manageList[0].rangeResetManagerEmailId.persona = val.persona
            manageList[0].rangeResetManagerEmailId.emailId = val.details.emailId
            manageList[0].rangeResetManagerEmailId.name = val.details.name
            manageList[0].rangeResetManagerEmailId.userId = val.details.userId
          }

          if (val.persona === 'Own Brand Manager') {
            manageList[0].ownBrandManagerEmailId.persona = val.persona
            manageList[0].ownBrandManagerEmailId.emailId = val.details.emailId
            manageList[0].ownBrandManagerEmailId.name = val.details.name
            manageList[0].ownBrandManagerEmailId.userId = val.details.userId
          }
          if (
            val.persona === 'Senior Buying Manager' ||
            val.persona === 'Senior Buying Manger'
          ) {
            manageList[0].seniorBuyingManagerEmailId.persona = val.persona
            manageList[0].seniorBuyingManagerEmailId.emailId =
              val.details.emailId
            manageList[0].seniorBuyingManagerEmailId.name = val.details.name
            manageList[0].seniorBuyingManagerEmailId.userId = val.details.userId
          }
          if (
            val.persona === 'Merchandiser' ||
            val.persona === 'Merchendiser'
          ) {
            manageList[0].merchandiserEmailId.persona = val.persona
            manageList[0].merchandiserEmailId.emailId = val.details.emailId
            manageList[0].merchandiserEmailId.name = val.details.name
            manageList[0].merchandiserEmailId.userId = val.details.userId
          }
          if (val.persona === 'Category Director') {
            manageList[0].categoryDirectorEmailId.persona = val.persona
            manageList[0].categoryDirectorEmailId.emailId = val.details.emailId
            manageList[0].categoryDirectorEmailId.name = val.details.name
            manageList[0].categoryDirectorEmailId.userId = val.details.userId
          }
          if (val.persona === 'Supply Chain Specialist') {
            manageList[0].supplyChainAnalystEmailId.persona = val.persona
            manageList[0].supplyChainAnalystEmailId.emailId =
              val.details.emailId
            manageList[0].supplyChainAnalystEmailId.name = val.details.name
            manageList[0].supplyChainAnalystEmailId.userId = val.details.userId
          }
        })
        console.log(manageList)
        setEventDetails(manageList)
        setIsProgressLoader(false)
      })
      .catch((err: any) => {
        console.log('EVENTID', err)
        setIsProgressLoader(false)
      })
  }

  useEffect(() => {
    // console.log('manageEventDummyData', manageEventDummyData)
    // console.log('ManagePageApiData', ManagePageApiData) // 1706 //9039 /1644 //9043 ADMIN //9044 RRM //9047
    // console.log(fileErrorData)
    if (location && location.state.data.eventId) {
      setIsProgressLoader(true)
      setTableLoading(true)
      console.log(location.state.data.eventId)
      getEventAndTasks(location.state.data.eventId)
      setTableLoading(false)
      getRangeResetPerEvent(location.state.data.eventId).then((res) => {
        if (
          res.data.items &&
          res.data.items !== null &&
          res.data.items !== []
        ) {
          // push to ReduxLogger
          setImportedData(true)
        }
      })
    }
    // else {
    //   history.push(`${DEFAULT}${RANGEAMEND_MANAGE}`)
    // }
  }, [location])

  useEffect(() => {
    getActionTypes &&
      getActionTypes('Action Type').then((res) =>
        setActionTypes(
          res.data.map((i: any) => {
            return { value: i.configValue, label: i.configValue }
          })
        )
      )
  }, [])

  const buyerTemplate = (rowData: any) => {
    return rowData.buyerEmailId.emailId
  }
  const buyingAssistantTemplate = (rowData: any) => {
    return rowData.buyerAssistantEmailId.emailId
  }
  const ownBrandManagerTemplate = (rowData: any) => {
    return rowData.ownBrandManagerEmailId.emailId
  }
  const seniorBuyingManagerTemplate = (rowData: any) => {
    return rowData.seniorBuyingManagerEmailId.emailId
  }
  const merchandiserTemplate = (rowData: any) => {
    return rowData.merchandiserEmailId.emailId
  }
  const rangeResetManagerTemplate = (rowData: any) => {
    return rowData.rangeResetManagerEmailId.emailId
  }
  const categoryDirectorTemplate = (rowData: any) => {
    return rowData.categoryDirectorEmailId.emailId
  }
  const supplyChainSplstTemplate = (rowData: any) => {
    return rowData.supplyChainAnalystEmailId.emailId
  }
  const handleProductTypeChange = (e: any) => {
    setProductType(e.target.value)
  }

  // const productIdTemplate = (rowData: any) => {
  //     return <TextFieldWithSearch value={productId} onChangeFn={setProductId} onSearch={console.log} />
  // }

  // const storeCodeTemplate = () => {
  //     return <TextFieldWithSearch value={storeCode} onChangeFn={setStoreCode} onSearch={console.log} />
  // }

  // const supplierTemplate = () => {
  //     return <TextFieldWithSearch value={supplier} onChangeFn={setSupplier} onSearch={console.log} />
  // }

  // const supplierSiteNumberTemplate = () => {
  //     return <TextFieldWithSearch value={supplierSiteNumber} onChangeFn={setSupplierSiteNumber} onSearch={console.log} />
  // }

  const localTemplate = (rowData: any) => {
    return (
      <select
        value={rowData.local}
        onChange={(e: any) => {
          setExistingSearchFields((prevState: any) => {
            return [
              {
                ...prevState[0],
                local: e.target.value,
              },
            ]
          })
        }}
        style={{
          height: '30px',
          padding: '5px',
        }}
      >
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    )
  }

  // const pinTemplate = () => {
  //     return <TextFieldWithSearch value={pin} onChangeFn={setPin} onSearch={console.log} />
  // }

  // const buyingMinIngredientsTemplate = () => {
  //     return <TextFieldWithSearch value={buyingMinIngredients} onChangeFn={setBuyingMinIngredients} onSearch={console.log} />
  // }

  const clearancePricingTemplate = (rowData: any) => {
    if (rowData['min/pin']) {
      if (rowData.clearancePricing === 'NA') {
        return (
          <select defaultValue={rowData.clearancePricing} disabled>
            <option value="NA">NA</option>
          </select>
        )
      } else {
        return (
          <select defaultValue={rowData.clearancePricing}>
            <option value="Exclude from">Exclude from</option>
            <option value="NA">NA</option>
          </select>
        )
      }
    }
  }

  const clearDepotByTemplate = (rowData: any) => {
    if (rowData['min/pin']) {
      if (rowData.clearDepotBy === 'NA') {
        return (
          <select defaultValue={rowData.clearDepotBy} disabled>
            <option value="NA">NA</option>
          </select>
        )
      } else {
        return (
          <select value={rowData.clearDepotBy}>
            <option value="Week-4">Week-4</option>
            <option value="NA">NA</option>
          </select>
        )
      }
    }
  }

  const handleActionType = (e: any) => {
    if (e) {
      setActionType(e)
    } else {
      setActionType('')
    }
  }

  const handleBulkActions = (e: any) => {
    if (e) {
      setBulkActions(e)
    } else {
      setBulkActions('')
    }
  }

  const handleUploadDialogOpen = () => {
    actionType && setOpenUploadDialog(true)
  }

  const handleUploadDialogClose = () => {
    setOpenUploadDialog(false)
    setUploadedFile(null)
  }

  const handleFileUpload = (event: any) => {
    setUploadedFile(event.target.files[0])
  }

  const handleUpload = (e: any) => {
    // e.preventDefault();
    handleUploadDialogClose()
    if (
      uploadedFile &&
      (uploadedFile.type === 'text/csv' ||
        uploadedFile.type === 'application/vnd.ms-excel' ||
        uploadedFile.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    ) {
      console.log(uploadedFile)
      import('xlsx').then((xlsx) => {
        const reader = new FileReader()
        reader.onload = (event: any) => {
          const wb = xlsx.read(event.target.result, { type: 'array' })
          const wsname = wb.SheetNames[0]
          const ws = wb.Sheets[wsname]
          const data = xlsx.utils.sheet_to_json(ws)
          console.log(data)
          const data1 = xlsx.utils.sheet_to_json(ws, { header: 1 })
          const cols: any = data1[0]

          let newData = data.map((d: any) => {
            if (d[cols[0]] && d[cols[0]] === actionTypeConstants[0]) {
              return {
                actionType: d[cols[0]] ? d[cols[0]] : '',
                min: d[cols[1]] ? d[cols[1]] : '',
                comments: d[cols[2]] ? d[cols[2]] : '',
                lineStatus: 'Request For Stock Count',
                man: 'NA',
                ingredientMin: 'NA',
                pin: '111111',
                description: 'Blahh Blahh',
                replaceMin: 'NA',
                replaceMinDescription: 'NA',
                existingSupplier: 'Futura-1001098',
                existingSupplierSite: 'Tetbury-9866',
                numberOfRangeStores: 'NA',
                storeCode: 'NA',
              }
            } else if (d[cols[0]] && d[cols[0]] === actionTypeConstants[5]) {
              return {
                actionType: d[cols[0]] ? d[cols[0]] : '',
                min: d[cols[1]] ? d[cols[1]] : '',
                numberOfRangeStores: d[cols[2]] ? d[cols[2]] : '',
                storeCode: d[cols[3]] ? d[cols[3]] : '',
                comments: d[cols[4]] ? d[cols[4]] : '',
                lineStatus: 'Draft',
                man: 'NA',
                ingredientMin: 'NA',
                pin: '111111',
                description: 'Blahh Blahh',
                replaceMin: 'NA',
                replaceMinDescription: 'NA',
                existingSupplier: 'Futura-1001098',
                existingSupplierSite: 'Tetbury-9866',
              }
            }
          })

          console.log(newData)
          if (importedData && importedData.length > 0) {
            setImportedData((prevState: any) => {
              return [...prevState, ...newData]
            })
          } else {
            setImportedData([...newData])
          }
        }

        reader.readAsArrayBuffer(uploadedFile)
      })
    } else {
      alert('Upload correct file')
      setUploadedFile(null)
    }
  }

  const uploadDialog = (
    <Dialog open={openUploadDialog} onClose={handleUploadDialogClose}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: small ? '400px' : '260px',
          // height: "250px",
          border: '3px solid green',
          borderRadius: 5,
        }}
      >
        <DialogHeader
          title={`Upload ${actionType && actionType.value}`}
          onClose={handleUploadDialogClose}
        />

        <Box sx={{ p: 1 }}>
          <Typography variant="body2" color="primary">
            Upload {actionType && actionType.value}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box>
            <input
              type="text"
              value={uploadedFile ? uploadedFile.name : ''}
              onClick={() => document.getElementById('selectedFile')!.click()}
              className={classes.uploadTextfield}
              placeholder="No file selected"
              readOnly
            />
            <Input
              type="file"
              id="selectedFile"
              accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFileUpload}
              required
            />
            <button
              type="button"
              onClick={() => document.getElementById('selectedFile')!.click()}
              className={classes.uploadButton}
            >
              Browse...
            </button>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            p: 2,
            justifyContent: 'right',
          }}
        >
          <Box>
            <Typography color="primary">
              Supported file type in MS Excel
              <i className="pi pi-file-excel" style={{ fontSize: '18px' }}></i>
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            p: 3,
            justifyContent: 'right',
          }}
        >
          <Button
            //   className={classes.submitButtons}
            variant="contained"
            color="primary"
            onClick={handleUpload}
          >
            Select
          </Button>
        </Box>
      </Box>
    </Dialog>
  )

  const handleActionTypeDialogOpen = () => {
    actionType && setOpenActionTypeDialog(true)
  }

  const handleActionTypeDialogClose = () => {
    setOpenActionTypeDialog(false)
    setMin('')
    setComments('')
    setNoOfStores('')
    setStoreCode('')
  }

  const handleFromDate = (date: any) => {
    // const newDate = date.getDate() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getFullYear()
    const newDate =
      parseInt(date.getMonth() + 1) +
      '-' +
      date.getDate() +
      '-' +
      date.getFullYear()
    console.log(newDate)
    setFromDate(newDate)
  }

  const handleToDate = (date: any) => {
    // const newDate = date.getDate() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getFullYear()
    const newDate =
      parseInt(date.getMonth() + 1) +
      '-' +
      date.getDate() +
      '-' +
      date.getFullYear()
    console.log(newDate)
    setToDate(newDate)
  }

  const handleAddProduct = (e: any) => {
    e.preventDefault()
    if (
      min ||
      replaceMinOrPin ||
      fromDate ||
      toDate ||
      addStoreCode ||
      comments
    ) {
      if (actionType && actionType.value !== 'Derange MIN') {
        let addData = {
          'action/type': actionType && actionType,
          'min/pin': min && min,
          description: 'NA',
          'replaceMin/pin': replaceMinOrPin ? replaceMinOrPin : 'NA',
          fromDate: fromDate ? fromDate : 'NA',
          toDate: toDate ? toDate : 'NA',
          lineStatus: 'Request For',
          clearancePricing: 'Include in',
          clearDepotBy: 'Week-4',
        }
        console.log(addData)
        if (importedData) {
          setImportedData((prevState: any) => {
            let newData = [...prevState]
            newData.push(addData)
            return newData
          })
        } else {
          setImportedData([addData])
        }
        // let newData = importedData ? [...importedData]: []
        // newData.push(addData)
        // console.log(newData);
        handleActionTypeDialogClose()
      }
    }
  }

  const handleManualRAF = () => {
    console.log('clicked')

    handleActionTypeDialogClose()
    if (actionType.value === actionTypeConstants[0]) {
      if (min !== '') {
        console.log('hello')
        const formData = {
          actionType: actionType.value,
          min: min,
          comments: comments,
          lineStatus: 'Request For Stock Count',
          man: 'NA',
          ingredientMin: 'NA',
          pin: '111111',
          description: 'Blahh Blahh',
          replaceMin: 'NA',
          replaceMinDescription: 'NA',
          existingSupplier: 'Futura-1001098',
          existingSupplierSite: 'Tetbury-9866',
          numberOfRangeStores: 'NA',
          storeCode: 'NA',
        }
        if (importedData && importedData.length > 0) {
          setImportedData((prevState: any) => {
            return [...prevState, formData]
          })
        } else {
          setImportedData([formData])
        }
      }
    } else if (actionType.value === actionTypeConstants[5]) {
      if (min) {
        console.log('hello')
        const formData = {
          actionType: actionType.value,
          min: min,
          comments: comments,
          lineStatus: 'Draft',
          man: 'NA',
          ingredientMin: 'NA',
          pin: '111111',
          description: 'Blahh Blahh',
          replaceMin: 'NA',
          replaceMinDescription: 'NA',
          existingSupplier: 'Futura-1001098',
          existingSupplierSite: 'Tetbury-9866',
          numberOfRangeStores: noOfStores ? noOfStores : 'NA',
          storeCode: storeCode ? storeCode : 'NA',
        }
        if (importedData && importedData.length > 0) {
          setImportedData((prevState: any) => {
            return [...prevState, formData]
          })
        } else {
          setImportedData([formData])
        }
      }
    }
  }

  const actionTypeDialog = (
    <Dialog
      open={openActionTypeDialog}
      onClose={handleActionTypeDialogClose}
      fullWidth
      classes={{ paperFullWidth: classes.placeholderDialog }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          //   width: small ? '500px' : '260px',
          // height: "250px",
          border: '3px solid green',
          borderRadius: 5,
          padding: '10px',
        }}
      >
        {/* <Box
          sx={{
            display: 'flex',
            height: 30,
            flexDirection: 'row',
            borderRadius: 10,
          }}
          //   className={classes.dialogTitle}
        >
          <Box
            sx={{
              display: 'flex',
              flexGrow: 1,
              justifyContent: 'center',
            }}
          >
            <Typography variant="subtitle1">Add {actionType}</Typography>
          </Box>
          <Box
            sx={{
              paddingRight: 2,
            }}
          >
            <button
              style={{
                border: 0,
                padding: 0,
                height: 22,
                width: 22,
              }}
              //   className={classes.dialogCloseButton}
              onClick={handleActionTypeDialogClose}
            >
              <b>X</b>
            </button>
          </Box>
        </Box> */}
        <DialogHeader
          title={`Add ${actionType && actionType.value}`}
          onClose={handleActionTypeDialogClose}
        />

        {/* <Box sx={{ p: 1 }}>
          <Typography variant="body2">Add {actionType}</Typography>
        </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <table cellPadding={'10px'}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <thead
                  style={{
                    fontSize: '12px',
                    textAlign: 'left',
                  }}
                >
                  <tr>
                    <th>{actionType}</th>
                    <th>
                      <TextField
                        variant="outlined"
                        // className={classes.addActionFields}
                        size="small"
                        value={min}
                        onChange={(e: any) => setMinOrPin(e.target.value)}
                        required
                      />
                    </th>
                  </tr>
                  <tr>
                    <th>Replace MIN/PIN</th>
                    <th>
                      <TextField
                        variant="outlined"
                        // className={classes.addActionFields}
                        size="small"
                        value={replaceMinOrPin}
                        onChange={(e: any) =>
                          setReplaceMinOrPin(e.target.value)
                        }
                      />
                    </th>
                  </tr>

                  <tr>
                    <th>Effective Date(from)</th>
                    <th>
                      <KeyboardDatePicker
                        format="dd/MM/yyyy"
                        inputVariant="outlined"
                        value={fromDate}
                        onChange={handleFromDate}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                        style={{
                          height: '35px',
                        }}
                        size="small"
                      />
                      
                    </th>
                  </tr>

                  <tr>
                    <th>Effective Date(to)</th>
                    <th>
                      <KeyboardDatePicker
                        format="dd/MM/yyyy"
                        inputVariant="outlined"
                        value={toDate}
                        onChange={handleToDate}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                        style={{
                          height: '35px',
                        }}
                        size="small"
                      />
                      
                    </th>
                  </tr>

                  {actionType === 'Derange MIN' && (
                    <tr>
                      <th>Store Code</th>
                      <th>
                        <TextField
                          variant="outlined"
                          //   className={classes.addActionFields}
                          size="small"
                          value={addStoreCode}
                          onChange={(e: any) => setAddStoreCode(e.target.value)}
                          required
                        />
                      </th>
                    </tr>
                  )}

                  <tr>
                    <th>Comments</th>
                    <th>
                      <TextField
                        variant="outlined"
                        // className={classes.addActionFields}
                        size="small"
                        value={comments}
                        onChange={(e: any) => setComments(e.target.value)}
                      />
                    </th>
                  </tr>
                </thead>
              </MuiPickersUtilsProvider>

            </table>
          </Box>

          <Box
            sx={{
              display: 'flex',
              p: 3,
              justifyContent: 'right',
            }}
          >
            <Button
              // className={classes.submitButtons}
              type="submit"
            >
              Add
            </Button>
          </Box> */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 1 }}>
            <Typography variant="subtitle2" color="primary">
              {`Add ${actionType && actionType.value}`}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              p: 1,
              width: '100%',
            }}
          >
            {actionType && actionType.value === actionTypeConstants[0] && (
              <>
                <Box
                  sx={{
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    // flexGrow: '1',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Delist MIN
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      {/* <input
                        type="text"
                        value={min}
                        onChange={(e: any) => setMin(e.target.value)}
                      /> */}
                      <OutlinedInput
                        value={min}
                        onChange={(e: any) => setMin(e.target.value)}
                        className={classes.inputFields}
                      />
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    // flexGrow: '1',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Comments
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      {/* <input
                        type="text"
                        value={comments}
                        onChange={(e: any) => setComments(e.target.value)}
                      /> */}
                      <OutlinedInput
                        value={comments}
                        onChange={(e: any) => setComments(e.target.value)}
                        className={classes.inputFields}
                      />
                    </Typography>
                  </Box>
                </Box>
              </>
            )}

            {actionType && actionType.value === actionTypeConstants[5] && (
              <>
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      New MIN
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      {/* <input
                        type="text"
                        value={min}
                        onChange={(e: any) => setMin(e.target.value)}
                      /> */}
                      <OutlinedInput
                        value={min}
                        onChange={(e: any) => setMin(e.target.value)}
                        className={classes.inputFields}
                      />
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      New no. of Range Stores
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      {/* <input
                        type="text"
                        value={noOfStores}
                        onChange={(e: any) => setNoOfStores(e.target.value)}
                      /> */}
                      <OutlinedInput
                        value={noOfStores}
                        onChange={(e: any) => setNoOfStores(e.target.value)}
                        className={classes.inputFields}
                      />
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Store Code
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      {/* <select
                        placeholder="--Select--"
                        value={storeCode}
                        onChange={(e: any) => setStoreCode(e.target.value)}
                        style={{ width: '160px' }}
                      >
                        <option value="001">Store-001</option>
                      </select> */}

                      <Select
                        value={storeCode}
                        onChange={(e) => setStoreCode(e.target.value)}
                        input={
                          <OutlinedInput
                            margin="dense"
                            className={classes.inputFields}
                          />
                        }
                      >
                        <MenuItem
                          value={'001'}
                          // key={type.id}
                          className={classes.muiSelect}
                        >
                          Store-001
                        </MenuItem>
                      </Select>
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      Comments
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary">
                      {/* <input
                        type="text"
                        value={comments}
                        onChange={(e: any) => setComments(e.target.value)}
                      /> */}
                      <OutlinedInput
                        value={comments}
                        onChange={(e: any) => setComments(e.target.value)}
                        className={classes.inputFields}
                      />
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
            <Box sx={{ p: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleManualRAF}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Dialog>
  )

  const existingProducts = (
    <form style={{ width: '100%' }}>
      <Grid
        item
        container
        xl={12}
        lg={12}
        md={12}
        sm={12}
        xs={12}
        style={{ alignItems: 'center' }}
      >
        <Grid item container xl={8} lg={8} md={8} sm={12} xs={12}>
          <DataTable
            value={existingSearchFields}
            scrollable
            showGridlines
            style={{
              height: '100%',
              width: '100%',
            }}
            className="p-datatable-sm"
          >
            {delistExistingProductsCols.map((col: any, index: any) => {
              return (
                <Column
                  key={index}
                  field={col.field}
                  header={col.header}
                  // style={{
                  //   width: col.width,
                  //   fontSize: '0.9rem',
                  //   padding: '0.5rem',
                  // }}
                  // headerStyle={{
                  //   backgroundColor: teal[900],
                  //   color: 'white',
                  //   width: col.width,
                  //   fontSize: '0.9rem',
                  //   padding: '0.5rem',
                  // }}
                  bodyStyle={tableBodyStyle(col.width)}
                  headerStyle={tableHeaderStyle(
                    col.width,
                    theme.palette.primary.main
                  )}
                  body={
                    // (col.field === "productId" && productIdTemplate)
                    // ||
                    // (col.field === "storeCode" && storeCodeTemplate)
                    // ||
                    // (col.field === "supplier" && supplierTemplate)
                    // ||
                    // (col.field === "supplierSiteNumber" && supplierSiteNumberTemplate)
                    // ||
                    col.field === 'local' && localTemplate
                    // ||
                    // (col.field === "pin" && pinTemplate)
                    // ||
                    // (col.field === "buyingMinIngredients" && buyingMinIngredientsTemplate)
                  }
                />
              )
            })}
          </DataTable>
        </Grid>
        <Grid
          item
          container
          xl={4}
          lg={4}
          md={4}
          sm={12}
          xs={12}
          style={{ textAlign: 'center' }}
          spacing={2}
        >
          <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
            <Button variant="contained" color="primary" type="submit">
              ADD
            </Button>
          </Grid>
          <Grid item xl={2} lg={2} md={2} sm={12} xs={12}>
            OR
          </Grid>
          <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUploadDialogOpen}
            >
              Upload File
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  )

  const submitNewProduct = (e: any) => {
    e.preventDefault()
    if (newProductId) {
      let newProductData: any = {
        productId: newProductId,
        description: '',
        'department/Category': 'Household & Pet Food/Pet Foods',
        lineStatus: 'Draft',
        type: 'New',
        clearancePricing: 'NA',
        clearDepotBy: 'NA',
      }
      if (importedData) {
        setImportedData((prevState: any) => {
          let newData = [...prevState]
          newData.push(newProductData)
          console.log(newData)
          return newData
        })
      } else {
        setImportedData([newProductData])
      }
    }
  }

  const newProducts = (
    <form style={{ width: '100%' }} onSubmit={submitNewProduct}>
      <Grid
        item
        container
        xl={12}
        lg={12}
        md={12}
        sm={12}
        xs={12}
        style={{ alignItems: 'end' }}
        spacing={2}
      >
        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
          New Products
          <br />
          <input
            type="text"
            required
            // className={classes.placeholderCountStyle}
            style={{
              width: small ? '88%' : '100%',
            }}
            value={newProductId}
            onChange={(e: any) => setNewProductId(e.target.value)}
          />
        </Grid>
        <Grid
          item
          xl={2}
          lg={2}
          md={2}
          sm={6}
          xs={12}
          style={{ textAlign: 'center' }}
        >
          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{ width: '80px' }}
          >
            ADD
          </Button>
        </Grid>
      </Grid>
    </form>
  )

  const submitPlaceholderProducts = (e: any) => {
    e.preventDefault()
    if (placeholderCount && supplierCode && salesChannels.length > 0) {
      let placeholderData: any = []
      for (var i = 0; i < placeholderCount; i++) {
        placeholderData.push({
          productId: `rand${Math.floor(100 + Math.random() * 900)}`,
          description: '',
          'department/Category': 'Household & Pet Food/Pet Foods',
          lineStatus: 'Draft',
          type: 'Placeholder',
          clearancePricing: 'NA',
          clearDepotBy: 'NA',
        })
      }
      console.log(placeholderData)
      if (importedData) {
        setImportedData((prevState: any) => {
          let newData = [...prevState]
          placeholderData.map((d: any) => {
            newData.push(d)
          })
          return newData
        })
      } else {
        setImportedData(placeholderData)
      }
    }
  }

  useEffect(() => {
    console.log(importedData)
  }, [importedData])

  //   const placeholderProducts = (
  //     <Grid
  //       item
  //       container
  //       xl={12}
  //       lg={12}
  //       md={12}
  //       sm={12}
  //       xs={12}
  //       style={{
  //         alignItems: 'center',
  //         padding: '10px',
  //       }}
  //       spacing={2}
  //     >
  //       <Grid item container md={7} sm={12} xs={12}>
  //         <Grid item xs={8}>
  //           <Typography variant="subtitle2" color="primary">
  //             How many new lines do you wish to enter?
  //             <br />
  //             <input
  //               type="text"
  //               required
  //               // className={classes.placeholderCountStyle}
  //               style={{
  //                 width: small ? '88%' : '100%',
  //               }}
  //               value={placeholderCount}
  //               onChange={(e: any) => setPlaceholderCount(e.target.value)}
  //             />
  //           </Typography>
  //         </Grid>
  //         <Grid
  //           item
  //           //   xl={2}
  //           //   lg={2}
  //           //   md={2}
  //           //   sm={6}
  //           xs={4}
  //           style={{ textAlign: 'center' }}
  //         >
  //           <Button
  //             variant="contained"
  //             color="primary"
  //             type="submit"
  //             style={{ width: '80px' }}
  //           >
  //             ADD
  //           </Button>
  //         </Grid>
  //       </Grid>

  //       <Grid item sm={1} xs={12}>
  //         <Typography variant="subtitle2" color="primary">
  //           OR
  //         </Typography>
  //       </Grid>
  //       <Grid item md={3} sm={12} xs={12}>
  //         <Button
  //           variant="contained"
  //           color="primary"
  //           // type="submit"
  //           // style={{ width: '80px' }}
  //         >
  //           Upload File
  //         </Button>
  //       </Grid>
  //     </Grid>
  //   )

  const handleTableStatusChange = (rowData: any, e: any) => {
    let newData: any = []
    importedData.map((d: any) => {
      if (d.min === rowData.min) {
        let selectValue = d
        selectValue.lineStatus = e.target.value
        newData.push(selectValue)
      } else {
        newData.push(d)
      }
    })
    console.log(newData)
    setImportedData(newData)
  }

  const lineStatusTemplate = (rowData: any) => {
    return (
      <select
        value={rowData.lineStatus}
        onChange={(e: any) => handleTableStatusChange(rowData, e)}
      >
        {lineStatusOptions.map((status: any) => {
          return (
            <option value={status.value} key={status.value}>
              {status.label}
            </option>
          )
        })}
      </select>
    )
  }

  const productListTable = (
    <Grid
      item
      container
      xl={12}
      lg={12}
      md={12}
      sm={12}
      xs={12}
      style={{ alignItems: 'center', paddingTop: '20px' }}
      spacing={2}
    >
      <Grid item xl={7} lg={7} md={7} sm={5} xs={12}>
        <Typography variant="subtitle1" color="primary">
          Product List
        </Typography>
      </Grid>
      <Grid item container xl={5} lg={5} md={5} sm={5} xs={12} spacing={2}>
        <Grid item xl={8} lg={8} md={8} sm={8} xs={7}>
          {/* <FormControl
            variant="outlined"
            style={{
              width: '90%',
            }}
          > */}
          {/* {!bulkActions && (
              <InputLabel
                id="demo-simple-select-outlined-label"
                style={{
                  color: 'white',
                  fontSize: '14px',
                }}
              >
                BULK ACTIONS
              </InputLabel>
            )} */}
          {/* <InputLabel>Bulk Actions</InputLabel>

            <Select
              value={bulkActions}
              // displayEmpty
              // inputProps={{ 'aria-label': 'Without label' }}
              onChange={(e: any) => setBulkActions(e.target.value)}
              className={classes.bulkActionSelect}
              // input={
              //   <OutlinedInput
              //     margin="dense"
              //     className={classes.bulkActionSelect}
              //     placeholder="BULK ACTIONS"
              //   />
              // }
            >
              
              {massActions.map((action: any) => {
                return (
                  <MenuItem value={action.value} key={action.value}>
                    {action.label}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl> */}
          <Typography color="primary">
            <AutocompleteSelect
              value={bulkActions}
              options={massActions}
              onChange={handleBulkActions}
              placeholder="Bulk Actions"
            />
          </Typography>
        </Grid>
        <Grid item xl={4} lg={4} md={4} sm={4} xs={5}>
          <Button variant="contained" color="primary">
            Refresh
          </Button>
        </Grid>
      </Grid>

      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
        <DataTable
          value={importedData && importedData}
          className="p-datatable-sm"
          // paginator
          // rows={10}
          // alwaysShowPaginator={false}
          // editMode="cell"
          selectionMode="checkbox"
          selection={selectedProductListItems}
          onSelectionChange={(e) => setSelectedProductListItems(e.value)}
          showGridlines
          scrollable
          rowHover
        >
          <Column
            selectionMode="multiple"
            headerStyle={{
              width: '50px',
              color: 'white',
              backgroundColor: teal[900],
            }}
          ></Column>
          {/* <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column> */}
          {productListCols.map((col: any, index: any) => {
            return (
              <Column
                key={index}
                field={col.field}
                header={col.header}
                body={
                  (col.field === 'lineStatus' && lineStatusTemplate) ||
                  (col.field === 'clearancePricing' &&
                    clearancePricingTemplate) ||
                  (col.field === 'clearDepotBy' && clearDepotByTemplate)
                }
                // style={{
                //   width: col.width,
                //   fontSize: '0.8rem',
                //   padding: '8px',
                // }}
                // headerStyle={{
                //   color: 'white',
                //   backgroundColor: teal[900],
                //   width: col.width,
                //   fontSize: '0.9rem',
                //   padding: '8px',
                // }}
                bodyStyle={tableBodyStyle(col.width)}
                headerStyle={tableHeaderStyle(
                  col.width,
                  theme.palette.primary.main
                )}
              />
            )
          })}
        </DataTable>
      </Grid>
      {/* <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
        <button
        //  className={classes.backButton}
        >
          <Typography variant="subtitle1">View More Columns</Typography>
        </button>
      </Grid> */}
    </Grid>
  )

  const handlePlaceholderDialogOpen = () => {
    setOpenPlaceholderDialog(true)
  }
  const handlePlaceholderDialogClose = () => {
    setOpenPlaceholderDialog(false)
  }

  const handlePlaceholderAdd = (count: any) => {
    if (count !== 0) {
      console.log('adding ', count)
      const newData: any = []
      for (var i = 0; i < count; i++) {
        var min = 1000000
        var max = 9999999
        var rand = Math.floor(min + Math.random() * (max - min))
        newData.push({
          actionType: 'Placeholder MIN',
          min: rand,
          comments: 'Add MIN to 275 store',
          lineStatus: 'Draft',
          man: 'NA',
          ingredientMin: 'NA',
          pin: 'NA    ',
          description: 'McCain Microwave Quick Chips',
          replaceMin: 'NA',
          replaceMinDescription: 'NA',
          existingSupplier: '',
          existingSupplierSite: '',
          numberOfRangeStores: '275',
          storeCode: '',
          ownBrand: '',
          barcode: '',
          casePack: '',
          local: 'Y',
          onlineCFC: 'Y',
          onlineStorePick: 'Y',
          wholesale: 'Y',
        })
      }

      console.log(newData)
      if (placeholderProducts && placeholderProducts.length > 0) {
        setPlaceholderProducts((prevState: any) => {
          return [...prevState, ...newData]
        })
      } else {
        setPlaceholderProducts(newData)
      }
    }
  }

  const removePlaceholder = () => {
    let _tasks = placeholderProducts.filter(
      (value: any) => !selectedPlaceholderData.includes(value)
    )
    console.log(_tasks)
    setPlaceholderProducts(_tasks)
    setSelectedPlaceholderData(null)
  }
  const handlePlaceholderSave = () => {
    handlePlaceholderDialogClose()
    setPlaceholderCount('')
    setPlaceholderProducts([])
    if (importedData && importedData.length > 0) {
      let newData = [...importedData, ...placeholderProducts]
      console.log(newData)
      setImportedData(newData)
    } else {
      setImportedData(placeholderProducts)
    }
  }

  const handlePlaceholderUploadOpen = () => {
    setOpenPlaceholderUpload(true)
  }
  const handlePlaceholderUploadClose = () => {
    setOpenPlaceholderUpload(false)
    setPlaceholderFile('')
  }

  const handlePlaceholderUpload = (event: any) => {
    setPlaceholderFile(event.target.files[0])
  }
  const handlePlaceholderFileUpload = () => {
    if (
      placeholderFile &&
      (placeholderFile.type === 'text/csv' ||
        placeholderFile.type === 'application/vnd.ms-excel' ||
        placeholderFile.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    ) {
      console.log(placeholderFile)
      import('xlsx').then((xlsx) => {
        const reader = new FileReader()
        reader.onload = (event: any) => {
          const wb = xlsx.read(event.target.result, { type: 'array' })
          const wsname = wb.SheetNames[0]
          const ws = wb.Sheets[wsname]
          const data = xlsx.utils.sheet_to_json(ws)
          console.log(data)
          const data1 = xlsx.utils.sheet_to_json(ws, { header: 1 })
          const cols: any = data1[0]

          let newData = data.map((d: any, index: any) => {
            return {
              actionType: 'Placeholder MIN',
              min: `0${index}00${index}`,
              comments: d[cols[12]] ? d[cols[12]] : '',
              lineStatus: 'Draft',
              man: 'NA',
              ingredientMin: 'NA',
              pin: 'NA    ',
              description: d[cols[0]] ? d[cols[0]] : '',
              replaceMin: 'NA',
              replaceMinDescription: 'NA',
              existingSupplier: d[cols[3]] ? d[cols[3]] : '',
              existingSupplierSite: d[cols[4]] ? d[cols[4]] : '',
              numberOfRangeStores: d[cols[6]] ? d[cols[6]] : '',
              storeCode: d[cols[7]] ? d[cols[7]] : '',
              ownBrand: d[cols[1]] ? d[cols[1]] : '',
              barcode: d[cols[2]] ? d[cols[2]] : '',
              casePack: d[cols[5]] ? d[cols[5]] : '',
              local: d[cols[8]] ? d[cols[8]] : '',
              onlineCFC: d[cols[9]] ? d[cols[9]] : '',
              onlineStorePick: d[cols[10]] ? d[cols[10]] : '',
              wholesale: d[cols[11]] ? d[cols[11]] : '',
            }
          })

          console.log(newData)
          if (placeholderProducts && placeholderProducts.length > 0) {
            setPlaceholderProducts((prevState: any) => {
              return [...prevState, ...newData]
            })
          } else {
            setPlaceholderProducts([...newData])
          }
        }

        reader.readAsArrayBuffer(placeholderFile)
      })
      handlePlaceholderUploadClose()
    } else {
      alert('Upload correct file')
      setPlaceholderFile(null)
    }
  }

  const uploadPlaceholderDialog = (
    <Dialog
      open={openPlaceholderUpload}
      onClose={handlePlaceholderUploadClose}
      fullWidth
      classes={{
        paperFullWidth: classes.placeholderDialog,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // width: small ? '400px' : '260px',
          // height: "250px",
          border: '3px solid green',
          borderRadius: 5,
        }}
      >
        <DialogHeader
          title={`Upload Placeholder Products`}
          onClose={handlePlaceholderUploadClose}
        />

        <Box sx={{ p: 1 }}>
          <Typography variant="body2" color="primary">
            Upload Placeholder Products
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box>
            <input
              type="text"
              value={placeholderFile ? placeholderFile.name : ''}
              onClick={() =>
                document.getElementById('placeholderFile')!.click()
              }
              className={classes.uploadTextfield}
              placeholder="No file selected"
              readOnly
            />
            <Input
              type="file"
              id="placeholderFile"
              accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handlePlaceholderUpload}
              required
            />
            <button
              type="button"
              onClick={() =>
                document.getElementById('placeholderFile')!.click()
              }
              className={classes.uploadButton}
            >
              Browse...
            </button>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            p: 2,
            justifyContent: 'right',
          }}
        >
          <Box>
            <Typography color="primary">
              Supported file type in MS Excel
              <i className="pi pi-file-excel" style={{ fontSize: '18px' }}></i>
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            p: 3,
            justifyContent: 'right',
          }}
        >
          <Button
            //   className={classes.submitButtons}
            variant="contained"
            color="primary"
            onClick={handlePlaceholderFileUpload}
          >
            Select
          </Button>
        </Box>
      </Box>
    </Dialog>
  )

  const onEditorValueChange = (props: any, value: any) => {
    let updatedProducts = [...props.value]
    updatedProducts[props.rowIndex][props.field] = value
    setPlaceholderProducts(updatedProducts)
  }

  const inputTextEditor = (props: any, field: any) => {
    return (
      <input
        type="text"
        value={props.rowData[field]}
        onChange={(e: any) => onEditorValueChange(props, e.target.value)}
      />
    )
  }

  const placeholderDialog = (
    <Dialog
      open={openPlaceholderDialog}
      onClose={handlePlaceholderDialogClose}
      fullWidth
      classes={{
        paperFullWidth:
          placeholderProducts && placeholderProducts.length > 0
            ? classes.placeholderDialogFull
            : classes.placeholderDialog,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // width: small ? "600px" : "260px",
          // height: "250px",
          border: '3px solid green',
          borderRadius: 5,
          padding: '10px',
        }}
      >
        <DialogHeader
          title="Add placeholder Products"
          onClose={handlePlaceholderDialogClose}
        />
        <Grid
          item
          container
          xl={12}
          lg={12}
          md={12}
          sm={12}
          xs={12}
          style={{
            textAlign: 'center',
            padding: '10px',
          }}
          spacing={2}
        >
          <Grid item md={7} sm={12} xs={12}>
            <Typography variant="subtitle2" color="primary">
              How many new lines do you wish to enter?
            </Typography>
          </Grid>
          <Grid item container md={7} sm={12} xs={12}>
            {/* <Grid item container xs={12}> */}

            <Grid item xs={12} sm={8}>
              <Typography variant="subtitle2" color="primary">
                <input
                  type="text"
                  required
                  // className={classes.placeholderCountStyle}
                  style={{
                    width: small ? '88%' : '100%',
                  }}
                  value={placeholderCount}
                  onChange={(e: any) => setPlaceholderCount(e.target.value)}
                />
              </Typography>
            </Grid>
            <Grid item sm={4} xs={12} style={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                style={{ width: '80px' }}
                onClick={() =>
                  handlePlaceholderAdd(placeholderCount ? placeholderCount : 0)
                }
              >
                ADD
              </Button>
            </Grid>
            {/* </Grid> */}
          </Grid>

          <Grid item md={1} sm={12} xs={12}>
            <Typography variant="subtitle2" color="primary">
              OR
            </Typography>
          </Grid>
          <Grid item md={3} sm={12} xs={12}>
            <Button
              variant="contained"
              color="primary"
              // type="submit"
              // style={{ width: '80px' }}
              onClick={handlePlaceholderUploadOpen}
            >
              Upload File
            </Button>
          </Grid>
          {placeholderProducts && placeholderProducts.length > 0 && (
            <Grid
              item
              container
              xs={12}
              style={{
                paddingLeft: '10px',
                paddingRight: '10px',
                paddingTop: '20px',
              }}
            >
              <Grid
                item
                xs={10}
                style={{ textAlign: 'left', paddingBottom: '5px' }}
              >
                <Typography variant="body2" color="primary">
                  Product List
                </Typography>
              </Grid>
              <Grid item xs={2} style={{ paddingBottom: '5px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handlePlaceholderAdd(1)}
                >
                  Add Row
                </Button>
              </Grid>
              <Grid item xs={12}>
                <DataTable
                  // rowHover
                  value={placeholderProducts}
                  // selectionMode="checkbox"
                  selection={selectedPlaceholderData}
                  onSelectionChange={(e) => setSelectedPlaceholderData(e.value)}
                  // globalFilter={globalFilter}
                  className="p-datatable-sm"
                  //   stateStorage="session"
                  //   stateKey="dt-state-demo-session-eventmanage"
                  showGridlines
                  scrollable
                  scrollHeight="300px"
                  editMode="cell"
                >
                  <Column
                    selectionMode="multiple"
                    headerStyle={{
                      width: '50px',
                      color: 'white',

                      backgroundColor: theme.palette.primary.main,
                    }}
                    // frozen
                  ></Column>
                  {placeholderCols.map((col: any) => {
                    return (
                      <Column
                        header={col.header}
                        field={col.field}
                        key={col.field}
                        bodyStyle={tableBodyStyle(col.width)}
                        headerStyle={tableHeaderStyle(
                          col.width,
                          theme.palette.primary.main
                        )}
                        editor={(props: any) =>
                          inputTextEditor(props, 'description')
                        }
                      />
                    )
                  })}
                </DataTable>
              </Grid>
              <Grid item xs={8}></Grid>
              <Grid item xs={2} style={{ paddingTop: '5px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={removePlaceholder}
                >
                  Delete
                </Button>
              </Grid>
              <Grid item xs={2} style={{ paddingTop: '5px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePlaceholderSave}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Box>
    </Dialog>
  )

  return (
    <>
      <Grid container spacing={2} style={{ padding: '20px' }}>
        <Grid
          container
          item
          xl={12}
          lg={12}
          md={12}
          sm={12}
          xs={12}
          spacing={2}
          style={{ paddingBottom: '20px' }}
        >
          <Grid item xl={9} lg={9} md={9} sm={12} xs={12}>
            <Typography variant="h6" color="primary">
              Pending Action -{' '}
              <b>Delists added to the Range Change Management App</b>
            </Typography>
          </Grid>

          <Grid item xl={2} lg={2} md={2} sm={3} xs={5}>
            <button
              // className={classes.backButton}
              className="backButton"
            >
              {/* <Typography variant="subtitle1" color="primary"> */}
              View Log
              {/* </Typography> */}
            </button>
          </Grid>

          <Grid item xl={1} lg={1} md={1} sm={3} xs={3}>
            <button
              // className={classes.backButton}
              className="backButton"
            >
              {/* <Typography variant="subtitle1" color="primary"> */}
              <svg
                className="MuiSvgIcon-root"
                focusable="false"
                viewBox="0 0 34 34"
                aria-hidden="true"
              >
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
              </svg>
              Back
              {/* </Typography> */}
            </button>
          </Grid>
        </Grid>
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
          <DataTable
            value={eventDetails}
            scrollable
            showGridlines
            style={{
              height: '100%',
            }}
            className="p-datatable-sm"
          >
            {manageEventPublishCols.map((col: any, index: any) => {
              return (
                <Column
                  key={index}
                  field={col.field}
                  header={col.header}
                  style={{
                    width: col.width,
                    fontSize: '0.9rem',
                    padding: '0.5rem',
                  }}
                  headerStyle={{
                    backgroundColor: teal[900],
                    color: 'white',
                    width: col.width,
                    fontSize: '0.9rem',
                    padding: '0.5rem',
                  }}
                  body={
                    (col.field === 'buyer' && buyerTemplate) ||
                    (col.field === 'buyerAssistant' &&
                      buyingAssistantTemplate) ||
                    (col.field === 'ownBrandManager' &&
                      ownBrandManagerTemplate) ||
                    (col.field === 'seniorBuyingManager' &&
                      seniorBuyingManagerTemplate) ||
                    (col.field === 'merchandiser' && merchandiserTemplate) ||
                    (col.field === 'rangeResetManager' &&
                      rangeResetManagerTemplate) ||
                    (col.field === 'categoryDirector' &&
                      categoryDirectorTemplate) ||
                    (col.field === 'supplyChainSplst' &&
                      supplyChainSplstTemplate)
                  }
                />
              )
            })}
          </DataTable>
        </Grid>
        <Grid
          item
          container
          xl={12}
          lg={12}
          md={12}
          sm={12}
          xs={12}
          spacing={2}
          style={{
            alignItems: 'center',
          }}
        >
          <Grid
            item
            container
            md={6}
            sm={12}
            xs={12}
            spacing={2}
            style={{ textAlign: 'center' }}
          >
            <Grid item xs={10} sm={5} style={{ textAlign: 'left' }}>
              <Typography color="primary">
                <AutocompleteSelect
                  value={actionType}
                  options={actionTypes}
                  onChange={handleActionType}
                  placeholder="Action Type"
                />
              </Typography>
            </Grid>
            <Grid item xs={2} sm={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleActionTypeDialogOpen}
              >
                Add
              </Button>
            </Grid>
            <Grid item xl={1} lg={1} md={1} sm={1} xs={12}>
              OR
            </Grid>
            <Grid item sm={4} xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUploadDialogOpen}
              >
                Upload File
              </Button>
            </Grid>
          </Grid>
          <Grid
            item
            container
            md={6}
            sm={12}
            xs={12}
            spacing={2}
            style={{ textAlign: 'center' }}
          >
            <Grid item sm={4} xs={12}>
              <button
                className="backButton"
                onClick={handlePlaceholderDialogOpen}
              >
                <Typography variant="body2" color="primary">
                  Add Placeholder MIN/PIN
                </Typography>
              </button>
            </Grid>
            <Grid item sm={4} xs={12}>
              <button
                className="backButton"
                // onClick={handlePlaceholderDialogOpen}
              >
                <Typography variant="body2" color="primary">
                  Replacement Association
                </Typography>
              </button>
            </Grid>
            <Grid item sm={4} xs={12}>
              <button
                className="backButton"
                // onClick={handlePlaceholderDialogOpen}
              >
                <Typography variant="body2" color="primary">
                  Issue Delist Letter
                </Typography>
              </button>
            </Grid>
          </Grid>
        </Grid>

        {/* <Grid item
                    xl={12}
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                >

                    <FormControl>
                        <RadioGroup
                            name="delistAddedToRange"
                            value={productType}
                            onChange={handleProductTypeChange}
                            style={{ display: "inline" }}>

                            <FormControlLabel value="existingProducts" control={radio} label="Existing Products" />
                            <FormControlLabel value="newProducts" control={radio} label="New Products" />
                            <FormControlLabel value="placeholderProducts" control={radio} label="Placeholder Products" />
                        </RadioGroup>
                    </FormControl>

                </Grid>
                <Grid item
                    xl={12}
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                >
                    {
                        productType &&
                            productType === "existingProducts" ?
                            existingProducts
                            :
                            productType === "newProducts" ?
                                newProducts
                                :
                                productType === "placeholderProducts" &&
                                placeholderProducts
                    }
                </Grid> */}

        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
          {importedData && productListTable}
        </Grid>

        {importedData && (
          <Grid item container xl={12} lg={12} md={12} sm={12} xs={12}>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}></Grid>
            <Grid
              item
              container
              xl={6}
              lg={6}
              md={6}
              sm={12}
              xs={12}
              style={{ textAlign: 'center' }}
              spacing={2}
            >
              <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
                <Button variant="contained" color="primary">
                  Save
                </Button>
              </Grid>
              <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
                <Button variant="contained" color="primary">
                  Submit Draft
                </Button>
              </Grid>
              <Grid item xl={4} lg={4} md={4} sm={4} xs={12}>
                <Button variant="contained" color="primary" disabled>
                  Confirm
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
      {uploadDialog}
      {actionTypeDialog}
      {placeholderDialog}
      {uploadPlaceholderDialog}
    </>
  )
}

export default DelistsAddedToRange
