<?
use \Bitrix\Main\{
    Application,
    Localization\Loc,
    Loader
};
use Bitrix\Crm\{FieldMultiTable, LeadTable};

define("NOT_CHECK_PERMISSIONS", true);
define("NEED_AUTH", false);
define("RESPONSIBLE_ID", 1);

require_once $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/bx_root.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

$answer = ['result' => true];
set_time_limit(0);

Loader::includeModule('crm');
try {
    $request = Application::getInstance()->getContext()->getRequest();
    $action = $request->get('action');

    switch ($action) {
        // Обработчик добавления Лида
        case 'getDeal';
            $t = [];
            $getDeal = new CCrmDeal(false);
            $dDeal = $getDeal::GetList([],[],['ID','TITLE','UF_CRM_1569506341','UF_CRM_1572957177','UF_CRM_1572957239','UF_CRM_1591089625','UF_CRM_1593965424','UF_CRM_1591100871']);
            while ($data = $dDeal->GetNext()){
                array_push($t,$data);
            }
            $answer = $t;
            break;
        case 'addlead';
            /**
             * Для телефона пеедаются данные вроде
             *     [{VALUE: "<номер телефона>", VALUE_TYPE: "<тип>"}]
             * Они сохраняются в переменных
             *     $phonevalue = <номер телефона>
             *     $phonevalue_type = <тип>
             */
            foreach (current($request->getPost('PHONE')) as $phoneParamCode => $phoneParamvalue) {
                $phoneVar = 'phone' . strtolower($phoneParamCode);
                $$phoneVar = trim($phoneParamvalue);
            }
            $leadClass = new CCrmLead(false);
            $fields = array_filter(
                $_POST,
                function($key) {
                    return in_array($key, ['TITLE', 'NAME', 'SOURCE_DESCRIPTION']) || preg_match('/^uf_/i', $key);
                },
                ARRAY_FILTER_USE_KEY
            );
            $filter = [
                'VALUE' => $phonevalue,
                'ENTITY_ID' => 'LEAD',
                'TYPE_ID' => 'PHONE',
                'VALUE_TYPE' => 'MOBILE'
            ];
            $phoneData = FieldMultiTable::GetList(['filter' => $filter])->Fetch();
            if (empty($phoneData['ELEMENT_ID'])) {
                $fields += [
                    'CREATED_BY_ID' => RESPONSIBLE_ID,
                    'MODIFY_BY_ID' => RESPONSIBLE_ID,
                    'ASSIGNED_BY_ID' => RESPONSIBLE_ID,
                ];
                $leadId = $leadClass->Add($fields);
                if (!$leadId) throw new Exception(Loc::getMessage('ERROR_LEAD_CREATING_PROBLEM'));

                $answer['data'] = ['ID' => $leadId, 'NEW' => true];
                $eventType = CCrmBizProcEventType::Create;
                FieldMultiTable::Add($filter + ['ELEMENT_ID' => $leadId]);

            } elseif (!$leadClass->Update($phoneData['ELEMENT_ID'], $fields)) {
                throw new Exception(Loc::getMessage('ERROR_LEAD_UPDATING_PROBLEM'));

            } else {
                $answer['data'] = ['ID' => $phoneData['ELEMENT_ID']];
                $eventType = CCrmBizProcEventType::Edit;
            }

            if (
                CCrmBizProcHelper::HasAutoWorkflows(CCrmOwnerType::Lead, $eventType)
                && !CCrmBizProcHelper::HasRunningWorkflows(CCrmOwnerType::Lead, $answer['data']['ID'])
            ) {
                CCrmBizProcHelper::AutoStartWorkflows(CCrmOwnerType::Lead, $answer['data']['ID'], $eventType, $errors);
            }
            break;

        // Обработчик добавления комментария к Лиду
        case 'addleadcomment';
            $leadId = $request->getPost('ID');
            if (!$leadId || empty(LeadTable::GetList(['filter' => ['ID' => $leadId]])->Fetch()))
                throw new Exception(Loc::getMessage('ERROR_BAD_LEAD_ID'));

            $messageValue = trim($request->getPost('MESSAGE'));
            if (empty($messageValue))
                throw new Exception(Loc::getMessage('ERROR_EMPTY_MESSAGE'));

            $fields = [
                'ENTITY_TYPE_ID' => CCrmOwnerType::Lead,
                'ENTITY_ID' => $leadId,
                'MESSAGE' => $messageValue,
                'USER_ID' => RESPONSIBLE_ID
            ];
            $answer['data'] = CCrmLiveFeed::CreateLogMessage($fields);
            break;

        default:
            throw new Exception(Loc::getMessage('ERROR_BAD_ACTION'));
    }

} catch (Exception $error) {
    $answer = array_merge($answer, ['result' => false, 'message' => $error->GetMessage()]);
}

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
die(json_encode($answer));