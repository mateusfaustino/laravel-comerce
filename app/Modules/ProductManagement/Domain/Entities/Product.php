<?php

namespace App\Modules\ProductManagement\Domain\Entities;

use Carbon\CarbonImmutable;

class Product
{
    private ?int $id = null;

    private ?CarbonImmutable $createdAt = null;

    private ?CarbonImmutable $updatedAt = null;

    private int $variacoesCount = 0;

    private ?int $thumbnailFotoId = null;

    /** @var array<int> */
    private array $categoryIds = [];

    /** @var array<int, string> */
    private array $categoryNames = [];

    public function __construct(
        private string $nome,
        private string $slug,
        private string $tipoProduto,
        private string $estoqueTipo = 'LIMITADO',
        private ?string $descricao = null,
        private ?string $sku = null,
        private ?string $codigoBarras = null,
        private ?string $peso = null,
        private ?string $largura = null,
        private ?string $altura = null,
        private ?string $comprimento = null,
        private bool $active = true,
    ) {}

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getNome(): string
    {
        return $this->nome;
    }

    public function setNome(string $nome): void
    {
        $this->nome = $nome;
    }

    public function getSlug(): string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): void
    {
        $this->slug = $slug;
    }

    public function getTipoProduto(): string
    {
        return $this->tipoProduto;
    }

    public function setTipoProduto(string $tipoProduto): void
    {
        $this->tipoProduto = $tipoProduto;
    }

    public function getEstoqueTipo(): string
    {
        return $this->estoqueTipo;
    }

    public function setEstoqueTipo(string $estoqueTipo): void
    {
        $this->estoqueTipo = $estoqueTipo;
    }

    public function getDescricao(): ?string
    {
        return $this->descricao;
    }

    public function setDescricao(?string $descricao): void
    {
        $this->descricao = $descricao;
    }

    public function getSku(): ?string
    {
        return $this->sku;
    }

    public function setSku(?string $sku): void
    {
        $this->sku = $sku;
    }

    public function getCodigoBarras(): ?string
    {
        return $this->codigoBarras;
    }

    public function setCodigoBarras(?string $codigoBarras): void
    {
        $this->codigoBarras = $codigoBarras;
    }

    public function getPeso(): ?string
    {
        return $this->peso;
    }

    public function setPeso(?string $peso): void
    {
        $this->peso = $peso;
    }

    public function getLargura(): ?string
    {
        return $this->largura;
    }

    public function setLargura(?string $largura): void
    {
        $this->largura = $largura;
    }

    public function getAltura(): ?string
    {
        return $this->altura;
    }

    public function setAltura(?string $altura): void
    {
        $this->altura = $altura;
    }

    public function getComprimento(): ?string
    {
        return $this->comprimento;
    }

    public function setComprimento(?string $comprimento): void
    {
        $this->comprimento = $comprimento;
    }

    public function isActive(): bool
    {
        return $this->active;
    }

    public function setActive(bool $active): void
    {
        $this->active = $active;
    }

    public function getThumbnailFotoId(): ?int
    {
        return $this->thumbnailFotoId;
    }

    public function setThumbnailFotoId(?int $thumbnailFotoId): void
    {
        $this->thumbnailFotoId = $thumbnailFotoId;
    }

    public function getCreatedAt(): ?CarbonImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(CarbonImmutable $createdAt): void
    {
        $this->createdAt = $createdAt;
    }

    public function getUpdatedAt(): ?CarbonImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(CarbonImmutable $updatedAt): void
    {
        $this->updatedAt = $updatedAt;
    }

    public function getVariacoesCount(): int
    {
        return $this->variacoesCount;
    }

    public function setVariacoesCount(int $count): void
    {
        $this->variacoesCount = $count;
    }

    /** @return array<int> */
    public function getCategoryIds(): array
    {
        return $this->categoryIds;
    }

    /** @param array<int> $categoryIds */
    public function setCategoryIds(array $categoryIds): void
    {
        $this->categoryIds = $categoryIds;
    }

    /** @return array<int, string> */
    public function getCategoryNames(): array
    {
        return $this->categoryNames;
    }

    /** @param array<int, string> $categoryNames */
    public function setCategoryNames(array $categoryNames): void
    {
        $this->categoryNames = $categoryNames;
    }
}
