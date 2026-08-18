<?php

namespace Modules\Movie\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;

class OmdbService
{
    protected $client;
    protected $apiKey;
    protected $baseUrl;

    public function __construct()
    {
        $this->client = new Client([
            'timeout' => 10,
            'connect_timeout' => 5,
        ]);

        $this->apiKey = config('modules.omdb.key');
        $this->baseUrl = config('modules.omdb.url');
    }

    public function search(
        string $title,
        ?string $type = null,
        ?int $year = null,
        int $page = 1
    ) {
        return $this->request([
            's' => $title,
            'type' => $type,
            'y' => $year,
            'page' => $page,
        ]);
    }

    public function getById(string $imdbId)
    {
        return $this->request([
            'i' => $imdbId,
            'plot' => 'full',
        ]);
    }

    protected function request(array $params)
    {
        // try {
            $response = $this->client->get($this->baseUrl, [
                'query' => array_filter(
                    array_merge($params, [
                        'apikey' => $this->apiKey,
                        'r' => 'json',
                    ]),
                    function ($value) {
                        return $value !== null && $value !== '';
                    }
                ),
            ]);


            $data = json_decode(
                $response->getBody()->getContents(),
                true
            );

            if (!is_array($data)) {
                Log::error('OMDb API returned invalid JSON.');

                return null;
            }

            if (
                isset($data['Response']) &&
                $data['Response'] === 'False'
            ) {
                Log::warning('OMDb API error.', [
                    'error' => $data['Error'] ?? 'Unknown OMDb error',
                ]);
            }

            return $data;
        // } catch (GuzzleException $e) {
        //     Log::error('OMDb HTTP request failed.', [
        //         'message' => $e->getMessage(),
        //     ]);

        //     return null;
        // } catch (\Throwable $e) {
        //     Log::error('OMDb unexpected error.', [
        //         'message' => $e->getMessage(),
        //     ]);

        //     return null;
        // }
    }
}