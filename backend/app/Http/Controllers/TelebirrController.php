<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelebirrController extends Controller
{
    public function telebirr(Request $request)
    {

        $appId = config('telebirr.app_id');
        $appKey = config('telebirr.app_key');

        $outTradeNo = uniqid();
        $nonce = uniqid();


        $data = [
            'outTradeNo' => $outTradeNo,
            'subject' => config('telebirr.subject'),
            'totalAmount' => $request->price,
            'shortCode' => config('telebirr.short_code'),
            'notifyUrl' => config('telebirr.notify_url'),
            'returnUrl' => config('telebirr.return_url'),
            'receiveName' => config('telebirr.receive_name'),
            'appId' => config('telebirr.app_id'),
            'timeoutExpress' => '30',
            'nonce' => $nonce,
            'timestamp' => strtotime(date('Y-m-d H:i:s')),
        ];

        $data['appKey'] = config('telebirr.app_key');
        ksort($data);

        $StringA = '';
        foreach ($data as $k => $v) {
            if ($StringA == '') {
                $StringA = $k . '=' . $v;
            } else {
                $StringA = $StringA . '&' . $k . '=' . $v;
            }
        }

        // Step 2
        $StringB = hash("sha256", $StringA);

        // Step 3
        $sign = strtoupper($StringB);

        // Step 4
        $ussdjson = json_encode($data);

        // Step 5
        $publicKey = config('telebirr.public_key');

        $pubPem = chunk_split($publicKey, 64, "\n");
        $pubPem = "-----BEGIN PUBLIC KEY-----\n" . $pubPem . "-----END PUBLIC KEY-----\n";
        $public_key = openssl_pkey_get_public($pubPem);
        if (!$public_key) {
            die('invalid public key');
        }
        $crypto = '';
        foreach (str_split($ussdjson, 117) as $chunk) {
            $return = openssl_public_encrypt(
                $chunk,
                $cryptoItem,
                $public_key
            );
            if (!$return) {
                return ('fail');
            }
            $crypto .= $cryptoItem;
        }
        $ussd = base64_encode($crypto);

        echo config('telebirr.web_url');

        $returnContent = Http::post(config('telebirr.web_url'), [
            'appid' => $appId,
            'sign' => $sign,
            'ussd' => $ussd
        ]);

        dd($returnContent->json());
    }

    // protected function genrateStringA($data)
    // {
    //     $StringA = '';
    //     foreach ($data as $k => $v) {
    //         if ($StringA == '') {
    //             $StringA = $k . '=' . $v;
    //         } else {
    //             $StringA = $StringA . '&' . $k . '=' . $v;
    //         }
    //     }

    //     return $StringA;
    // }

    // public function genrateSign($StringA)
    // {
    //     $StringB = hash("sha256", $StringA);

    //     return $StringB;
    // }

    // public function genrateUSSD($data)
    // {
    //     $pubPem = chunk_split(config('telebirr.public_key'), 64, "\n");
    //     $pubPem = "-----BEGIN PUBLIC KEY-----\n" . $pubPem . "-----END PUBLIC KEY-----\n";
    //     $public_key = openssl_pkey_get_public($pubPem);
    //     if (!$public_key) {
    //         die('invalid public key');
    //     }
    //     $crypto = '';
    //     foreach (str_split(json_encode($data), 117) as $chunk) {
    //         $return = openssl_public_encrypt(
    //             $chunk,
    //             $cryptoItem,
    //             $public_key
    //         );
    //         if (!$return) {
    //             return ('fail');
    //         }
    //         $crypto .= $cryptoItem;
    //     }
    //     return base64_encode($crypto);
    // }

    public function response(Request $request)
    {
        $pubPem = chunk_split(config('telebirr.public_key'), 64, "\n");
        $pubPem = "-----BEGIN PUBLIC KEY-----\n" . $pubPem . "-----END PUBLIC KEY-----\n";
        $public_key = openssl_pkey_get_public($pubPem);
        if (!$public_key) {
            die('invalid public key');
        }
        $decrypted = ''; //decode must be done before spliting for getting the binary String
        $data = str_split(base64_decode($request->getContent()), 256);
        foreach ($data as $chunk) {
            $partial = ''; //be sure to match padding
            $decryptionOK = openssl_public_decrypt($chunk, $partial, $public_key, OPENSSL_PKCS1_PADDING);
            if ($decryptionOK === false) {
                die('fail');
            }
            $decrypted .= $partial;
        }

        Log::info("\n\ndecrypted_message: " . $decrypted);
        return $decrypted;
    }
}
